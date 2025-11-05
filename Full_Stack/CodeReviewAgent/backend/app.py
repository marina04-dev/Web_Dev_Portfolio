import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- IMPORTANT: Imports your agent logic ---
# This line connects the Flask app to the Python function in your agent file
try:
    from code_reviewer_agent import process_code_review 
except ImportError:
    # Exit if the agent file is not found, as the app is unusable without it
    print("FATAL ERROR: Could not find 'code_reviewer_agent.py'. Please ensure it is in the same folder.")
    sys.exit(1)


# --- SETUP AND INITIALIZATION ---

# Load environment variables (like OPENAI_API_KEY) from the .env file
load_dotenv() 

# Initialize Flask App
app = Flask(__name__)

# Configure CORS: Essential for allowing the React frontend (running on a different port)
# to make API requests to this backend without browser security errors.
CORS(app) 

# --- API ENDPOINT ---
@app.route('/api/review-code', methods=['POST'])
def review_code_endpoint():
    """
    Handles POST requests from the frontend containing code and a review request.
    It calls the core Code Review Agent logic (process_code_review).
    """
    # 1. Input Validation and Parsing
    try:
        data = request.get_json()
        code = data.get('code', '').strip()
        review_request = data.get('request', '').strip()

        if not code or not review_request:
            return jsonify({
                'error': 'Missing code or review request in payload. Please ensure both fields are filled.'
            }), 400
        
        print(f"Received request for review focus: {review_request[:50]}...")
        
    except Exception as e:
        print(f"ERROR: Failed to parse incoming JSON: {e}")
        return jsonify({'error': f'Invalid JSON payload: {str(e)}'}), 400


    # 2. Agent Execution
    try:
        # Call the core agent function
        review_result_pydantic = process_code_review(code, review_request)

        if not review_result_pydantic:
             # This indicates an internal failure within the LLM pipeline
             return jsonify({
                 'error': 'Agent failed to produce a structured review. Check your backend console logs for details.'
             }), 500

        # Convert the Pydantic model into a standard Python dictionary before sending as JSON.
        return jsonify(review_result_pydantic.model_dump()), 200

    except Exception as e:
        # Catch all other execution errors
        print(f"FATAL AGENT EXECUTION ERROR: {e}")
        # Return a generic server error to the client
        return jsonify({
            'error': 'An internal server error occurred during agent processing.', 
            'details': str(e)
        }), 500

if __name__ == '__main__':
    # Flask is set to run on port 5000 by default.
    # Run using the command: python app.py
    print("--- Starting Flask Code Review API Server ---")
    print("API Endpoint: http://127.0.0.1:5000/api/review-code")
    app.run(debug=True, port=5000)