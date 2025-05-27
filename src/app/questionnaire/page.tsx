/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/questionnaire/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  ListChecks,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// --- AI Suggestion Parsing Logic (Should be at the top of the file) ---
interface RoadmapHighlightItem {
  title: string;
  description: string;
  isProjectIdea?: boolean;
}

interface FormattedSuggestionSection {
  title?: string;
  content?: string;
  items?: RoadmapHighlightItem[];
}

const listItemRegex =
  /^(\d+)\.\s*\*\*(.*?):\*\*\s*([\s\S]*?)(?=\n\n?\s*\d+\.\s*\*\*|\n\n?\s*\*\*(Project Idea(?:s)?):\*\*|$)/gm;

function parseAndStructureSuggestion(
  suggestionText: string | null | undefined
): FormattedSuggestionSection[] {
  if (!suggestionText) {
    return [];
  }
  const sections: FormattedSuggestionSection[] = [];
  const careerPathBlockMatch = suggestionText.match(
    /^\*\*(Suggested Career Path):\*\*\s*([\s\S]*?)(?=\n\n?\*\*(Learning Roadmap Highlights):\*\*|$)/i
  );
  let remainingTextForHighlights = suggestionText;

  if (
    careerPathBlockMatch &&
    careerPathBlockMatch[1] &&
    careerPathBlockMatch[2]
  ) {
    sections.push({
      title: careerPathBlockMatch[1].trim(),
      content: careerPathBlockMatch[2].trim(),
    });
    remainingTextForHighlights = suggestionText
      .substring(careerPathBlockMatch[0].length)
      .trim();
  } else {
    const highlightsTitleExists =
      /\*\*(Learning Roadmap Highlights):\*\*/i.test(suggestionText);
    if (!highlightsTitleExists && !careerPathBlockMatch) {
      sections.push({
        title: "AI Generated Suggestion",
        content: suggestionText.trim(),
      });
      return sections;
    }
  }

  const roadmapHighlightsBlockMatch = remainingTextForHighlights.match(
    /^\*\*(Learning Roadmap Highlights):\*\*\s*([\s\S]*)/i
  );
  if (roadmapHighlightsBlockMatch && roadmapHighlightsBlockMatch[2]) {
    const highlightsContent = roadmapHighlightsBlockMatch[2].trim();
    const roadmapItems: RoadmapHighlightItem[] = [];
    let match;
    listItemRegex.lastIndex = 0;
    while ((match = listItemRegex.exec(highlightsContent)) !== null) {
      roadmapItems.push({
        title: match[2].trim(),
        description: match[3].trim().replace(/\n\s*\n/g, "\n"),
        isProjectIdea: match[2].toLowerCase().includes("project idea"),
      });
    }
    if (roadmapItems.length > 0) {
      sections.push({
        title: roadmapHighlightsBlockMatch[1].trim(),
        items: roadmapItems,
      });
    } else if (highlightsContent) {
      sections.push({
        title: roadmapHighlightsBlockMatch[1].trim(),
        content: highlightsContent,
      });
    }
  }

  if (sections.length === 0 && suggestionText) {
    sections.push({
      title: "AI Generated Suggestion",
      content: suggestionText,
    });
  }
  return sections;
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

// --- Questions Array ---
interface QuestionOption {
  value: string;
  label: string;
}
interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "text" | "textarea";
  options?: QuestionOption[];
  isMultiSelect?: boolean;
  placeholder?: string;
  required?: boolean;
}

const generalQuestions: Question[] = [
  {
    id: "q1_tech_excitement",
    text: "What excites you the most when using technology?",
    type: "checkbox",
    isMultiSelect: true,
    required: true,
    options: [
      {
        value: "Browse_websites",
        label: "Browse informative and beautiful websites",
      },
      { value: "using_mobile_apps", label: "Using helpful or fun mobile apps" },
      {
        value: "solving_problems_tech",
        label: "Seeing technology solve complex problems",
      },
      {
        value: "creating_digital_content",
        label: "Creating digital content (art, videos, music)",
      },
      {
        value: "gaming_interactive_exp",
        label: "Playing games or using interactive experiences",
      },
      {
        value: "other_excitement",
        label: "Something else (I'll describe in interests)",
      },
    ],
  },
  {
    id: "q2_work_focus",
    text: "Do you enjoy working more with visuals (like design), logic (like solving puzzles), or communication (like writing or talking)?",
    type: "radio",
    required: true,
    options: [
      { value: "visuals", label: "Visuals (Design, Aesthetics)" },
      { value: "logic", label: "Logic (Puzzles, Systems, Problem-solving)" },
      {
        value: "communication",
        label: "Communication (Writing, Explaining, Teamwork)",
      },
      { value: "balanced_mix", label: "A good mix of these" },
    ],
  },
  {
    id: "q3_online_learning",
    text: "Have you ever tried learning something online (like a YouTube tutorial, online course, or blog)?",
    type: "radio",
    required: true,
    options: [
      { value: "yes_enjoyed", label: "Yes, and I enjoyed it" },
      { value: "yes_hard", label: "Yes, but it was challenging for me" },
      { value: "no_not_yet", label: "No, not yet, but I'm willing to try" },
    ],
  },
  {
    id: "q4_creation_aspiration",
    text: "What kind of things would you love to create one day?",
    type: "checkbox",
    isMultiSelect: true,
    required: true,
    options: [
      { value: "mobile_app_creation", label: "A mobile app" },
      { value: "website_creation", label: "A personal website or blog" },
      {
        value: "online_business_creation",
        label: "An online business or e-commerce site",
      },
      { value: "game_creation", label: "A game" },
      {
        value: "ai_tool_creation",
        label: "A tool that uses AI to help people",
      },
      { value: "other_creation", label: "Something else entirely" },
    ],
  },
  {
    id: "q5_learning_style_preference",
    text: "Which of these learning styles suits you best?",
    type: "radio",
    required: true,
    options: [
      { value: "watching_videos", label: "Watching videos and demonstrations" },
      {
        value: "reading_articles",
        label: "Reading articles, books, and documentation",
      },
      {
        value: "hands_on_projects",
        label: "Doing hands-on projects and experimenting",
      },
      {
        value: "discussion_collaboration",
        label: "Talking and discussing with others",
      },
      { value: "structured_courses", label: "Following structured courses" },
    ],
  },
  {
    id: "q6_teamwork_preference",
    text: "Do you prefer working alone or in a team?",
    type: "radio",
    required: true,
    options: [
      { value: "mostly_alone", label: "Mostly alone" },
      { value: "mostly_team", label: "Mostly in a team" },
      { value: "balanced_solo_team_work", label: "A good balance of both" },
    ],
  },
  {
    id: "q7_dream_work_environment",
    text: "What kind of work environment do you dream of?",
    type: "radio",
    required: true,
    options: [
      { value: "remote_work", label: "Remote (work from anywhere)" },
      { value: "office_job", label: "Office job (structured, in-person)" },
      {
        value: "freelancing_work",
        label: "Freelancing (flexible, project-based)",
      },
      { value: "startup_own_business", label: "Building my own startup" },
      { value: "not_sure_environment", label: "Not sure yet" },
    ],
  },
  {
    id: "q8_weekly_learning_time",
    text: "How much time can you realistically dedicate each week to learning new tech skills?",
    type: "radio",
    required: true,
    options: [
      { value: "time_very_low", label: "Less than 3 hours" },
      { value: "time_low", label: "3 - 7 hours" },
      { value: "time_medium", label: "8 - 15 hours" },
      { value: "time_high", label: "15+ hours" },
    ],
  },
  {
    id: "q9_topics_of_interest",
    text: "What topics do you find interesting or want to explore more? (Select all that apply)",
    type: "checkbox",
    isMultiSelect: true,
    required: true,
    options: [
      { value: "websites_and_design", label: "Websites & Visual Design" },
      { value: "mobile_app_dev", label: "Mobile Apps" },
      { value: "game_dev", label: "Games & Interactive Media" },
      { value: "ai_ml", label: "Artificial Intelligence & Machine Learning" },
      {
        value: "business_startups_tech",
        label: "Business, E-commerce & Startups",
      },
      { value: "cybersecurity", label: "Cybersecurity & Digital Safety" },
      {
        value: "social_media_content_creation",
        label: "Social Media & Content Creation Tech",
      },
      { value: "data_analysis", label: "Data, Numbers & Analytics" },
      {
        value: "not_sure_explore_topics",
        label: "I’m not sure yet, open to exploring!",
      },
    ],
  },
  {
    id: "q10_prior_tech_exposure",
    text: "Have you used any programming tools or languages before (like HTML, Python, block-based coding like Scratch, etc.)?",
    type: "radio",
    required: true,
    options: [
      {
        value: "completely_new_to_coding",
        label: "No, I’m completely new to this",
      },
      {
        value: "dabbled_basics",
        label: "I’ve dabbled or tried a few basic things",
      },
      {
        value: "built_small_exercises",
        label: "I’ve built some small personal projects or exercises",
      },
      {
        value: "solid_coding_experience",
        label: "I have some solid experience or have taken courses",
      },
    ],
  },
  {
    id: "q11_learning_language",
    text: "What is your preferred language for learning technical content (e.g., English, বাংলা, Hindi)?",
    type: "text",
    required: false,
    placeholder: "e.g., English",
  },
  {
    id: "q12_short_term_goals",
    text: "Do you have any specific goals you want to achieve in the next 1-2 years through tech? (e.g., get a specific job, build an app, start a business)",
    type: "textarea",
    required: false,
    placeholder: "Describe your goals...",
  },
];
// --- END OF QUESTIONS ---

export default function QuestionnairePage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {}
  );
  const [rawSuggestionResult, setRawSuggestionResult] = useState<string | null>(
    null
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const structuredSuggestionSections: FormattedSuggestionSection[] =
    useMemo(() => {
      return parseAndStructureSuggestion(rawSuggestionResult);
    }, [rawSuggestionResult]);

  // ---- DEFINE suggestionToDisplay HERE ----
  const careerPathSection = structuredSuggestionSections.find((s) =>
    s.title?.toLowerCase().includes("suggested career path")
  );
  const suggestionToDisplay =
    careerPathSection?.content ||
    (structuredSuggestionSections.length > 0 &&
    structuredSuggestionSections[0]?.content &&
    !structuredSuggestionSections[0].items
      ? structuredSuggestionSections[0].content
      : null) ||
    (structuredSuggestionSections.length === 0 && rawSuggestionResult
      ? rawSuggestionResult
      : null);
  // ---- END OF DEFINITION ----

  useEffect(() => {
    document.title = "Developer Questionnaire - DevNexus";
    if (!authIsLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if ((rawSuggestionResult || submitError) && !submitLoading) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [rawSuggestionResult, submitError, submitLoading]);

  function handleInputChange(
    questionId: string,
    value: string,
    questionType?: string,
    isMultiSelect?: boolean
  ) {
    if (questionType === "checkbox" && isMultiSelect) {
      setAnswers((prev) => {
        const existingValues = (prev[questionId] as string[] | undefined) || [];
        if (existingValues.includes(value)) {
          return {
            ...prev,
            [questionId]: existingValues.filter((item) => item !== value),
          };
        } else {
          return { ...prev, [questionId]: [...existingValues, value] };
        }
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setRawSuggestionResult(null);
    if (!user || !user.email) {
      setSubmitError("User email not found. Please ensure you are logged in.");
      return;
    }
    for (const q of generalQuestions) {
      if (q.required) {
        const answer = answers[q.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          setSubmitError(`Please answer the question: "${q.text}"`);
          return;
        }
      }
    }
    setSubmitLoading(true);
    try {
      const interestsPayload =
        (answers.q9_topics_of_interest as string[] | undefined) || [];
      const apiPayload = {
        email: user.email,
        answers: answers,
        interests: interestsPayload,
      };
      const response = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
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

        {(!rawSuggestionResult || submitError) && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {generalQuestions.map((q, index) => (
              <div
                key={q.id}
                className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <label className="block mb-2.5 text-lg font-semibold text-gray-800">
                  <span className="text-blue-600 font-bold">Q{index + 1}:</span>{" "}
                  {q.text}
                  {!q.required && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Optional)
                    </span>
                  )}
                </label>
                {q.type === "radio" && q.options && (
                  <div className="space-y-2 mt-2">
                    {(q.options as QuestionOption[]).map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center space-x-3 p-2.5 hover:bg-blue-50/70 rounded-md cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={
                            (answers[q.id] as string | undefined) === opt.value
                          }
                          onChange={(e) =>
                            handleInputChange(
                              q.id,
                              e.target.value,
                              q.type,
                              q.isMultiSelect
                            )
                          }
                          required={q.required}
                          className="form-radio h-5 w-5 text-blue-600 border-gray-400 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white"
                        />
                        <span className="text-gray-700 select-none text-sm font-medium">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "checkbox" && q.options && q.isMultiSelect && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-2">
                    {(q.options as QuestionOption[]).map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center space-x-3 p-2.5 hover:bg-blue-50/70 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={opt.value}
                          checked={(
                            (answers[q.id] as string[] | undefined) || []
                          ).includes(opt.value)}
                          onChange={() =>
                            handleInputChange(
                              q.id,
                              opt.value,
                              q.type,
                              q.isMultiSelect
                            )
                          }
                          className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 rounded focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white"
                        />
                        <span className="text-gray-700 select-none text-sm font-medium">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "text" && (
                  <input
                    type="text"
                    id={q.id}
                    value={(answers[q.id] as string | undefined) || ""}
                    onChange={(e) =>
                      handleInputChange(
                        q.id,
                        e.target.value,
                        q.type,
                        q.isMultiSelect
                      )
                    }
                    required={q.required}
                    className="w-full border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white text-base"
                    placeholder={q.placeholder || "Type your answer here..."}
                  />
                )}
                {q.type === "textarea" && (
                  <textarea
                    id={q.id}
                    value={(answers[q.id] as string | undefined) || ""}
                    onChange={(e) =>
                      handleInputChange(
                        q.id,
                        e.target.value,
                        q.type,
                        q.isMultiSelect
                      )
                    }
                    rows={3}
                    required={q.required}
                    className="w-full border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white text-base"
                    placeholder={q.placeholder || "Share your thoughts..."}
                  />
                )}
              </div>
            ))}
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

        <div ref={resultsRef} className="mt-10 pt-8">
          {submitError && (
            <div className="p-6 bg-red-50 text-red-800 rounded-xl border-2 border-red-300 shadow-lg flex items-start">
              <AlertTriangle
                size={32}
                className="text-red-600 mr-4 flex-shrink-0 mt-1"
              />
              <div>
                {" "}
                <h3 className="text-xl font-bold mb-1">
                  Oops! Something went wrong.
                </h3>{" "}
                <p className="text-md">{submitError}</p>{" "}
                <button
                  onClick={() => {
                    setSubmitError(null);
                    setRawSuggestionResult(null);
                    setAnswers({});
                  }}
                  className="mt-4 text-sm text-blue-600 hover:underline font-semibold"
                >
                  {" "}
                  Try filling the questionnaire again{" "}
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
                {suggestionToDisplay ? ( // <<--- THIS IS WHERE THE ERROR OCCURS
                  <div>
                    <div className="flex items-center mb-3">
                      <Lightbulb
                        size={26}
                        className="text-yellow-500 mr-3 flex-shrink-0"
                      />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Suggested Career Path & Initial Steps
                      </h3>
                    </div>
                    <div className="text-md text-gray-700 leading-relaxed whitespace-pre-wrap prose max-w-none md:pl-10">
                      {renderFormattedText(
                        suggestionToDisplay,
                        "text-gray-700",
                        "text-blue-700"
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No specific suggestion could be extracted, but your full
                    response has been saved. Check your dashboard for details.
                  </p>
                )}

                <p className="mt-8 text-center">
                  <Link
                    href="/dashboard"
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150 ease-in-out font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-green-500/40"
                  >
                    {" "}
                    View Full Details on My Dashboard{" "}
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
