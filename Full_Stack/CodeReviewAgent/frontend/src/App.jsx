import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Zap, Shield, Code, List, AlertTriangle, CheckCircle } from 'lucide-react';

// NOTE: The Flask server is assumed to be running on this port
const API_URL = 'http://127.0.0.1:5000/api/review-code'; 

/**
 * Main application component for the Code Review Agent frontend.
 * This component manages the UI, state, API calls, and result display.
 */
const App = () => {
  // --- State Management ---
  const [code, setCode] = useState(`def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]\n\n# Example of a file reading function with a potential security issue:\ndef load_data(filename):\n    # Issue: Unsanitized input used in file operation\n    with open(filename, 'r') as f:\n        return f.read()`);
  const [reviewRequest, setReviewRequest] = useState('Check the file operation function for security vulnerabilities.');
  const [reviewReport, setReviewReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Utility Functions ---

  /**
   * Defines colors and icons based on the severity score.
   */
  const getSeverityStyle = useCallback((score) => {
    if (score >= 8) {
      return { className: 'bg-red-500/10 text-red-500 border-red-500', icon: AlertTriangle };
    }
    if (score >= 5) {
      return { className: 'bg-orange-500/10 text-orange-500 border-orange-500', icon: AlertTriangle };
    }
    return { className: 'bg-green-500/10 text-green-500 border-green-500', icon: CheckCircle };
  }, []);

  /**
   * Defines colors and icons for the request type.
   */
  const getTypeStyle = useCallback((type) => {
    switch (type) {
      case 'Security':
        return { className: 'bg-indigo-600', icon: Shield };
      case 'Performance':
        return { className: 'bg-green-600', icon: Zap };
      case 'Style':
        return { className: 'bg-yellow-600', icon: List };
      default:
        return { className: 'bg-gray-500', icon: Code };
    }
  }, []);

  // --- API Interaction ---

  const handleReview = useCallback(async () => {
    if (isLoading || !code || !reviewRequest) return;

    setIsLoading(true);
    setError(null);
    setReviewReport(null);

    // Prepare exponential backoff for retries (max 3 tries)
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, request: reviewRequest }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the server returns a 4xx or 5xx, throw an error
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }

            // Success
            setReviewReport(data);
            setIsLoading(false);
            return; // Exit the retry loop

        } catch (err) {
            attempt++;
            console.error(`Attempt ${attempt} failed:`, err.message);
            if (attempt >= maxRetries) {
                // Final failure
                setError(`Failed to get a review after ${maxRetries} attempts. Server Error: ${err.message}`);
                setIsLoading(false);
                return;
            }
            // Wait with exponential backoff before the next attempt
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
  }, [code, reviewRequest, isLoading]);


  // --- Render Components ---

  /**
   * Component for the structured Review Report output.
   */
  const ReviewOutput = useMemo(() => {
    if (!reviewReport) return null;

    const { className: severityClass, icon: SeverityIcon } = getSeverityStyle(reviewReport.severity_score);
    const { className: typeClass, icon: TypeIcon } = getTypeStyle(reviewReport.request_type);

    return (
      <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <List className="w-6 h-6 mr-2 text-indigo-600" />
            Agent Review Report
          </h2>
          <div className={`px-4 py-1 text-sm font-semibold rounded-full flex items-center ${typeClass} text-white`}>
            <TypeIcon className="w-4 h-4 mr-1" />
            {reviewReport.request_type} Check
          </div>
        </div>

        {/* Severity Score */}
        <div className={`p-4 rounded-lg flex items-center mb-6 ${severityClass} border-l-4`}>
          <SeverityIcon className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <span className="font-semibold">Severity Score: {reviewReport.severity_score}/10</span>
            <p className="text-sm">This score rates the urgency and impact of the primary issue found.</p>
          </div>
        </div>

        {/* Reasoning */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-100 pb-1">Detailed Reasoning</h3>
        <p className="whitespace-pre-wrap text-gray-600 mb-6 leading-relaxed">{reviewReport.reasoning}</p>

        {/* Tool Findings (if present) */}
        {reviewReport.tool_findings && reviewReport.tool_findings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-100 pb-1">Tool Findings (Linter/Static Analysis)</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-4">
              {reviewReport.tool_findings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-mono text-xs inline-block w-20 flex-shrink-0 mr-2 text-red-500">{finding.line}</span>
                  <span>{finding.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Suggested Refactored Code */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-1">Suggested Refactored Code</h3>
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto shadow-inner text-sm">
          <code>{reviewReport.suggested_refactored_code}</code>
        </pre>
      </div>
    );
  }, [reviewReport, getSeverityStyle, getTypeStyle]);

  // --- Main Render ---

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[Inter] flex flex-col items-center">
      <script src="https://cdn.tailwindcss.com"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <header className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">LLM Code Review Agent</h1>
        <p className="text-gray-600">Specialized triaging agent for Security, Performance, and Style analysis.</p>
      </header>

      <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <div className="space-y-6">
          {/* Code Input */}
          <div>
            <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Code className="w-4 h-4 mr-1 text-indigo-500" /> Code Snippet (Python Example)
            </label>
            <textarea
              id="code-input"
              rows="10"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-y"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
            ></textarea>
          </div>

          {/* Review Request Input */}
          <div>
            <label htmlFor="request-input" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <RefreshCw className="w-4 h-4 mr-1 text-indigo-500" /> Review Focus
            </label>
            <input
              id="request-input"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={reviewRequest}
              onChange={(e) => setReviewRequest(e.target.value)}
              placeholder="e.g., 'Check for performance issues' or 'Review for Pythonic style'"
            />
          </div>
          
          {/* Action Button */}
          <button
            onClick={handleReview}
            disabled={isLoading || !code || !reviewRequest}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 flex items-center justify-center ${
              isLoading || !code || !reviewRequest
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing Review...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Run Code Review
              </>
            )}
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Output Display */}
        {ReviewOutput}
      </div>
      
      <footer className="mt-10 text-sm text-gray-500 max-w-4xl w-full text-center">
        Powered by an LLM-based, multi-stage agent architecture using structured Pydantic output.
      </footer>
    </div>
  );
};

export default App;
