import os
import json
import logging
from typing import Optional, Literal, Dict, Any

from openai import OpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# --- 1. SETUP AND INITIALIZATION ---

# Load environment variables from the .env file (for API Key)
load_dotenv()

# Set up logging for detailed output and debugging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# Initialize the OpenAI Client
# The key is loaded securely via os.getenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o-mini" # Using a fast, cost-effective model for this task

# --- 2. Pydantic Models for Structured Output (Data Contracts) ---

class ReviewType(BaseModel):
    """
    Model for the Router Agent. Forces classification of the user's intent.
    This guarantees reliable input for the subsequent workflow steps.
    """
    # Literal forces the LLM to choose only one of these three exact strings.
    request_type: Literal["Security", "Performance", "Style"] = Field(
        description="The primary focus of the code review request."
    )
    # A confidence score is good practice for gating or warning about ambiguous requests.
    confidence_score: float = Field(
        description="Confidence (0.0 to 1.0) of the classification."
    )

class ReviewReport(BaseModel):
    """
    The final, structured output model returned to the frontend.
    The frontend is expecting JSON that matches this exact schema.
    """
    suggested_refactored_code: str = Field(
        description="The complete, corrected, and refactored code snippet based on the review findings."
    )
    reasoning: str = Field(
        description="Detailed explanation of the problems found and why the refactoring was necessary."
    )
    severity_score: int = Field(
        description="An overall severity score from 0 (perfect) to 10 (critical issues)."
    )
    review_summary: str = Field(
        description="A concise, natural language summary of the overall review results."
    )
    risk_flags: list[str] = Field(
        description="A list of specific, categorized issues found (e.g., 'SQL Injection Risk', 'Inefficient Loop', 'Missing Docstrings')."
    )

# --- 3. Tool Definition (Mock Linter) ---

def mock_linter(code: str) -> Dict[str, Any]:
    """
    MOCK TOOL: Simulates a linter or static analysis tool. 
    In a real app, this would execute Pylint, Black, or another tool.
    It detects common style and performance issues.
    """
    logger.info("Executing mock_linter tool...")
    findings = []

    # Simple checks
    if 'sum_val = 0' in code and 'for num in list_of_numbers' in code:
        findings.append("Inefficient sum calculation detected (should use built-in sum() or NumPy).")
    if 'range(a, b):' in code:
        findings.append("Function 'compute_sum' is missing a docstring.")
    if 'calculate_average' in code and 'len(list_of_numbers)' in code:
        findings.append("Missing error handling for empty list (ZeroDivisionError risk).")

    if not findings:
        return {"result": "No obvious performance or style issues found by static analysis."}
    else:
        return {"result": "Static analysis found issues. Findings: " + "; ".join(findings)}

# Define the tool structure for the LLM
tools = [
    {
        "type": "function",
        "function": {
            "name": "mock_linter",
            "description": "Run a static analysis tool (linter) to check code for performance and style violations.",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {"type": "string", "description": "The code snippet to analyze."},
                },
                "required": ["code"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    }
]


# --- 4. CORE AGENT FUNCTIONS (THE PIPELINE) ---

def route_request(code: str, request_text: str) -> Optional[ReviewType]:
    """
    LLM Call 1: Classifies the user's intent (Routing/Triage step).
    """
    system_prompt = (
        "You are an expert code review router. Classify the user's request into one of the following "
        "categories: 'Security', 'Performance', or 'Style'. Always select the category that best "
        "matches the user's focus. Provide a high confidence score if the request is clear."
    )
    
    user_prompt = f"Code snippet:\n---\n{code}\n---\nUser Request: {request_text}"

    try:
        completion = client.beta.chat.completions.parse(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=ReviewType,
        )
        # .parsed automatically returns the Pydantic object
        return completion.choices[0].message.parsed
    except Exception as e:
        logger.error(f"Routing LLM call failed: {e}")
        return None


def generate_final_review(code: str, request_text: str, tool_output: Optional[str], route_type: str) -> Optional[ReviewReport]:
    """
    LLM Call 2: Synthesizes all information (code, request, tool output) into the final structured report.
    """
    
    # Contextualize the prompt based on the determined review type and tool output
    context = ""
    if tool_output:
        context = f"Static Analysis Tool Findings (CRITICAL CONTEXT):\n---\n{tool_output}\n---"

    system_prompt = (
        f"You are a Senior Code Reviewer specializing in {route_type} issues. "
        "Your task is to analyze the user-provided code based on the user's request and the provided "
        "tool output (if any). You must strictly generate the ReviewReport model. "
        "1. Identify the issues (especially using the tool findings). "
        "2. Provide a clean, corrected version of the code (suggested_refactored_code). "
        "3. Assign a severity score: 0 (no issues) to 10 (critical vulnerability/bug). "
        "4. Be thorough in your reasoning and use the 'risk_flags' list to categorize every major issue you find."
    )
    
    user_prompt = f"Original Code:\n---\n{code}\n---\nUser Request Focus: {request_text}\n\n{context}"

    try:
        completion = client.beta.chat.completions.parse(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=ReviewReport,
        )
        return completion.choices[0].message.parsed
    except Exception as e:
        logger.error(f"Final Review LLM call failed: {e}")
        return None


def process_code_review(code: str, request_text: str) -> Optional[ReviewReport]:
    """
    The main orchestration function called by the Flask server.
    Implements the Routing -> Tool -> Synthesis pipeline.
    """
    logger.info("--- Starting Code Review Pipeline ---")
    
    # 1. ROUTING / TRIAGE
    route = route_request(code, request_text)
    if not route:
        logger.error("Pipeline aborted: Failed to classify review type.")
        return None
        
    logger.info(f"Routed to: {route.request_type} (Confidence: {route.confidence_score:.2f})")
    
    # Optional: Gating check for low confidence
    if route.confidence_score < 0.6:
        logger.warning("Low confidence score detected. Proceeding, but results may be ambiguous.")
    
    tool_output = None
    
    # 2. TOOL EXECUTION (Conditional)
    if route.request_type in ["Performance", "Style"]:
        # Only run the mock_linter tool for these types of requests
        logger.info(f"Running tool 'mock_linter' for {route.request_type} request...")
        try:
            tool_result = mock_linter(code)
            tool_output = json.dumps(tool_result)
            logger.info(f"Tool execution successful. Output: {tool_output[:100]}...")
        except Exception as e:
            logger.error(f"Tool execution failed: {e}")
            # Do not abort, just proceed without tool context
            
    # 3. FINAL SYNTHESIS
    final_report = generate_final_review(code, request_text, tool_output, route.request_type)
    
    if not final_report:
        logger.error("Pipeline aborted: Failed to generate final report.")
        return None

    logger.info(f"--- Pipeline Completed. Severity: {final_report.severity_score} ---")
    return final_report


# --- 5. STANDALONE TEST EXECUTION (FOR LOCAL TESTING) ---

if __name__ == "__main__":
    # Example 1: Security Check (Direct LLM Reasoning)
    code_1 = """
def load_data(filename):
    # Potential path traversal or command injection risk if filename is not sanitized.
    with open(filename, 'r') as f:
        return f.read()

def process():
    data = load_data('user_input.txt')
    # ...
"""
    request_1 = "Please check this function specifically for file operation security vulnerabilities."
    print("\n" + "="*80)
    print("EXAMPLE 1: Security Check (Direct LLM Reasoning)")
    print("="*80)
    review_1 = process_code_review(code_1, request_1)
    if review_1:
        print(f"\n[SEVERITY: {review_1.severity_score}]")
        print(f"\n[REASONING]:\n{review_1.reasoning}")
        print("\n[REFACTORED CODE]:")
        print(review_1.suggested_refactored_code)


    # Example 2: Style/Performance Request (triggers the mock linter tool)
    code_2 = """
def compute_sum(a, b):
    # Missing docstring and long function
    total = 0
    for x in range(a, b):
        total += x
    return total

def calculate_average(list_of_numbers):
    # Missing error handling
    sum_val = 0
    for num in list_of_numbers:
        sum_val += num
    return sum_val / len(list_of_numbers)
"""
    request_2 = "Can you check this code for Python best practices, including style and performance efficiency?"
    print("\n" + "="*80)
    print("EXAMPLE 2: Style/Performance Check (Triggers Mock Linter Tool)")
    print("="*80)
    review_2 = process_code_review(code_2, request_2)
    if review_2:
        print(f"\n[SEVERITY: {review_2.severity_score}]")
        print(f"\n[REASONING]:\n{review_2.reasoning}")
        print("\n[REFACTORED CODE]:")
        print(review_2.suggested_refactored_code)