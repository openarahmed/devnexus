/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/questionnaire/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react"; // Added useRef
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Send,
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle,
  Target,
  ListChecks, // Still imported if parser uses it, but won't be rendered explicitly here
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// --- Start of AI Suggestion Parsing Logic ---
interface RoadmapHighlightItem {
  title: string;
  description: string;
  isProjectIdea?: boolean;
}

interface ParsedAISuggestion {
  suggestedCareerPath?: string;
  learningRoadmapHighlights: RoadmapHighlightItem[]; // Parser will still populate this
}

const listItemRegex =
  /^(\d+)\.\s*\*\*(.*?):\*\*\s*([\s\S]*?)(?=\n\n?\s*\d+\.\s*\*\*|\n\n?\s*\*\*(Project Idea(?:s)?):\*\*|$)/gm;

function parseAndStructureSuggestion(
  suggestionText: string | null | undefined
): ParsedAISuggestion {
  const parsed: ParsedAISuggestion = {
    suggestedCareerPath: undefined,
    learningRoadmapHighlights: [],
  };

  if (!suggestionText) return parsed;

  const careerPathBlockMatch = suggestionText.match(
    /^\*\*(Suggested Career Path):\*\*\s*([\s\S]*?)(?=\n\n?\*\*(Learning Roadmap Highlights):\*\*|$)/i
  );
  let remainingTextForHighlights = suggestionText;

  if (careerPathBlockMatch && careerPathBlockMatch[2]) {
    parsed.suggestedCareerPath = careerPathBlockMatch[2].trim();
    remainingTextForHighlights = suggestionText
      .substring(careerPathBlockMatch[0].length)
      .trim();
  } else {
    // If no clear "Suggested Career Path" title, check if "Learning Roadmap Highlights" exists later
    // If not, assume the whole text might be the career path or a general suggestion.
    const highlightsTitleExists =
      /\*\*(Learning Roadmap Highlights):\*\*/i.test(suggestionText);
    if (!highlightsTitleExists) {
      parsed.suggestedCareerPath = suggestionText.trim(); // Treat whole thing as career path
      return parsed; // No highlights to parse
    }
  }

  const roadmapHighlightsBlockMatch = remainingTextForHighlights.match(
    /^\*\*(Learning Roadmap Highlights):\*\*\s*([\s\S]*)/i
  );
  if (roadmapHighlightsBlockMatch && roadmapHighlightsBlockMatch[2]) {
    const highlightsContent = roadmapHighlightsBlockMatch[2].trim();
    let match;
    listItemRegex.lastIndex = 0;
    while ((match = listItemRegex.exec(highlightsContent)) !== null) {
      parsed.learningRoadmapHighlights.push({
        title: match[2].trim(),
        description: match[3].trim().replace(/\n\s*\n/g, "\n"),
        isProjectIdea: match[2].toLowerCase().includes("project idea"),
      });
    }
  }

  // If only career path was parsed and no highlights section found explicitly AFTER it.
  if (
    parsed.suggestedCareerPath &&
    parsed.learningRoadmapHighlights.length === 0 &&
    !roadmapHighlightsBlockMatch
  ) {
    // This means the entire text was likely just the career path. Highlights remain empty.
  } else if (
    !parsed.suggestedCareerPath &&
    parsed.learningRoadmapHighlights.length === 0 &&
    suggestionText
  ) {
    // Fallback if nothing structured was found, treat whole text as career path suggestion
    parsed.suggestedCareerPath = suggestionText.trim();
  }

  return parsed;
}

const renderFormattedText = (
  text: string | undefined,
  baseTextColor = "text-gray-700",
  boldTextColor = "text-sky-700"
): React.ReactNode => {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className={`font-semibold ${boldTextColor}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split("\n").map((line, i) => (
      <React.Fragment key={`${index}-${i}`}>
        {line}
        {i < part.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  });
};
// --- End of AI Suggestion Parsing Logic ---

const questions = [
  {
    id: "q1",
    question: "What is your primary interest in development?",
    options: ["Frontend", "Backend", "Fullstack", "DevOps", "AI/ML", "Mobile"],
  },
  {
    id: "q2",
    question: "What is your preferred work style or environment?",
    options: [
      "Fast-paced Startup",
      "Structured Corporate",
      "Independent Freelance",
      "Fully Remote",
      "Collaborative On-site",
    ],
  },
  {
    id: "q3",
    question: "How much programming experience do you currently have?",
    options: [
      "Just starting out (None)",
      "Beginner (0-1 year)",
      "Intermediate (1-3 years)",
      "Advanced (3+ years)",
    ],
  },
  {
    id: "q4",
    question: "What type of projects excite you the most?",
    options: [
      "Building beautiful UIs (Web Apps)",
      "Creating robust APIs (Backend Systems)",
      "Working with data (Data Science)",
      "Automating processes (DevOps/Scripting)",
      "Developing mobile experiences (Mobile Apps)",
    ],
  },
  {
    id: "q5",
    question:
      "Which programming language are you most interested in or enjoy using?",
    options: [
      "JavaScript/TypeScript",
      "Python",
      "Java",
      "C#",
      "Go",
      "Rust",
      "Other",
    ],
  },
];
const interestOptions = [
  "Web Development",
  "UI/UX Design",
  "Data Analysis & Visualization",
  "Machine Learning Engineering",
  "Game Development",
  "iOS/Android Development",
  "Cloud Computing & Architecture",
  "Cybersecurity",
  "Blockchain Technology",
];

export default function QuestionnairePage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null); // <<--- REF FOR SCROLLING TO RESULTS

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [rawSuggestionResult, setRawSuggestionResult] = useState<string | null>(
    null
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const parsedSuggestion: ParsedAISuggestion = useMemo(() => {
    return parseAndStructureSuggestion(rawSuggestionResult);
  }, [rawSuggestionResult]);

  useEffect(() => {
    document.title = "Developer Questionnaire - DevNexus";
    if (!authIsLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, authIsLoading, router]);

  // Effect to scroll to results when they appear
  useEffect(() => {
    if ((rawSuggestionResult || submitError) && !submitLoading) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [rawSuggestionResult, submitError, submitLoading]);

  function handleChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleCheckboxChange(value: string) {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setRawSuggestionResult(null);
    if (!user || !user.email) {
      setSubmitError("User email not found. Please ensure you are logged in.");
      return;
    }
    if (Object.keys(answers).length < questions.length) {
      setSubmitError("Please answer all multiple-choice questions.");
      return;
    }
    if (interests.length === 0) {
      setSubmitError("Please select at least one specific interest.");
      return;
    }
    setSubmitLoading(true);
    try {
      const response = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, answers, interests }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.message || "Failed to submit answers.");
      } else {
        setRawSuggestionResult(
          data.suggestion || "Thank you! Your suggestion is being processed."
        );
      }
    } catch (error) {
      setSubmitError("An error occurred while submitting answers.");
      console.error("Questionnaire submit error:", error);
    } finally {
      setSubmitLoading(false);
    }
  }

  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <Loader2 size={40} className="animate-spin text-blue-400 mb-4" />
        <p className="text-lg">Loading Questionnaire or Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Lighter background */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl text-gray-800">
        <div className="text-center mb-8">
          <Zap
            size={48}
            className="mx-auto text-yellow-500 mb-3 transform -rotate-12"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Your Developer Compass
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Answer a few questions to chart your course in the tech world!
          </p>
          {user?.email && (
            <p className="mt-2 text-sm text-blue-700">
              Responses for: <strong>{user.email}</strong>
            </p>
          )}
        </div>
        {/* Show form only if no result or error yet, OR if there was an error and user wants to retry */}
        {(!rawSuggestionResult || submitError) && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map(({ id, question, options }, index) => (
              <div
                key={id}
                className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <label
                  htmlFor={id}
                  className="block mb-2.5 text-lg font-semibold text-gray-800"
                >
                  <span className="text-blue-600 font-bold">Q{index + 1}:</span>{" "}
                  {question}
                </label>
                <select
                  id={id}
                  required
                  value={answers[id] || ""}
                  onChange={(e) => handleChange(id, e.target.value)}
                  className="w-full border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white text-base"
                >
                  <option value="" disabled>
                    {" "}
                    -- Select an option --{" "}
                  </option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <p className="mb-3 text-lg font-semibold text-gray-800">
                <span className="text-blue-600 font-bold">
                  Q{questions.length + 1}:
                </span>{" "}
                What are your specific interests?{" "}
                <span className="text-sm font-normal text-gray-500">
                  (Select all that apply)
                </span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {interestOptions.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-3 p-2.5 hover:bg-blue-50/70 rounded-md cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      value={opt}
                      checked={interests.includes(opt)}
                      onChange={() => handleCheckboxChange(opt)}
                      className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 rounded focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white"
                    />
                    <span className="text-gray-700 select-none text-sm font-medium">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-300 text-center">
              <button
                type="submit"
                disabled={submitLoading}
                className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-10 py-4 rounded-lg hover:from-blue-700 hover:to-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-200 ease-in-out font-semibold text-lg flex items-center justify-center w-full sm:w-auto disabled:opacity-70 shadow-lg hover:shadow-sky-500/30 disabled:shadow-none"
              >
                {submitLoading ? (
                  <Loader2 size={24} className="animate-spin mr-2.5" />
                ) : (
                  <Send size={22} className="mr-2.5" />
                )}
                {submitLoading
                  ? "Crafting Your Path..."
                  : "Get My Personalized Roadmap"}
              </button>
            </div>
          </form>
        )}
        {/* Result/Error Display Section - This will be scrolled into view */}
        <div ref={resultsRef} className="mt-10 pt-8 border-t border-gray-300">
          {submitError && (
            <div className="p-6 bg-red-50 text-red-800 rounded-xl border-2 border-red-300 shadow-lg flex items-start">
              <AlertTriangle
                size={32}
                className="text-red-600 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Oops! Something went wrong.
                </h3>
                <p className="text-md">{submitError}</p>
                <button
                  onClick={() => {
                    setSubmitError(null);
                    setRawSuggestionResult(
                      null
                    ); /* Optionally clear answers/interests */
                  }}
                  className="mt-4 text-sm text-blue-600 hover:underline font-semibold"
                >
                  Try filling the questionnaire again
                </button>
              </div>
            </div>
          )}

          {rawSuggestionResult && !submitError && (
            <section>
              <div className="text-center mb-8">
                <Sparkles size={40} className="mx-auto text-green-500 mb-2" />
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Your AI Suggestion is Ready!
                </h2>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-200 space-y-6">
                {/* Display ONLY Suggested Career Path */}
                {parsedSuggestion.suggestedCareerPath ? (
                  <div>
                    <div className="flex items-center mb-3">
                      <Target
                        size={26}
                        className="text-yellow-500 mr-3 flex-shrink-0"
                      />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Suggested Career Path
                      </h3>
                    </div>
                    <div className="text-md text-gray-700 leading-relaxed whitespace-pre-wrap prose max-w-none md:pl-10">
                      {renderFormattedText(
                        parsedSuggestion.suggestedCareerPath,
                        "text-gray-700",
                        "text-blue-700"
                      )}
                    </div>
                  </div>
                ) : (
                  // Fallback if career path isn't parsed but raw result exists
                  rawSuggestionResult && (
                    <div>
                      <div className="flex items-center mb-3">
                        <Lightbulb
                          size={24}
                          className="text-yellow-500 mr-2.5 flex-shrink-0"
                        />
                        <h3 className="text-2xl font-semibold text-gray-700">
                          AI Generated Suggestion
                        </h3>
                      </div>
                      <div className="text-md text-gray-700 leading-relaxed whitespace-pre-wrap prose max-w-none">
                        {renderFormattedText(
                          rawSuggestionResult,
                          "text-gray-700",
                          "text-blue-700"
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* Learning Roadmap Highlights are NOT rendered here as per your request */}

                <p className="mt-8 text-center">
                  <Link
                    href="/dashboard"
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150 ease-in-out font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-green-500/40"
                  >
                    View Full Details on My Dashboard{" "}
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                </p>
              </div>
            </section>
          )}
        </div>{" "}
        {/* End of resultsRef div */}
      </div>
    </div>
  );
}
