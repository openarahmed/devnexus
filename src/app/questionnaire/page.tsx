/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

const questions = [
  {
    id: "q1",
    question: "What is your primary interest?",
    options: ["Frontend", "Backend", "Fullstack", "DevOps", "AI/ML", "Mobile"],
  },
  {
    id: "q2",
    question: "What is your preferred work style?",
    options: ["Startup", "Corporate", "Freelance", "Remote", "On-site"],
  },
  {
    id: "q3",
    question: "How much experience do you have?",
    options: ["None", "0-1 year", "1-3 years", "3+ years"],
  },
  {
    id: "q4",
    question: "What type of projects do you enjoy?",
    options: ["Web Apps", "Mobile Apps", "Data Science", "Automation", "Games"],
  },
  {
    id: "q5",
    question: "What’s your favorite programming language?",
    options: ["JavaScript", "Python", "Java", "C#", "Go", "Other"],
  },
];

const interestOptions = [
  "Web Development",
  "UI/UX",
  "Data Science",
  "Machine Learning",
  "Game Dev",
  "Mobile Apps",
  "Cloud",
];

export default function QuestionnairePage() {
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    if (!email) {
      setResult("Please enter your registered email.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers, interests }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data.message || "Failed to get suggestions.");
      } else {
        setResult(data.suggestion);
      }
    } catch (error) {
      setResult("Error fetching suggestions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Developer Career Questionnaire
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Enter your registered email:
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        {questions.map(({ id, question, options }) => (
          <div key={id} className="mb-4">
            <p className="mb-2 font-semibold">{question}</p>
            <select
              required
              value={answers[id] || ""}
              onChange={(e) => handleChange(id, e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select an option
              </option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="mb-4">
          <p className="mb-2 font-semibold">
            What are your specific interests?
          </p>
          {interestOptions.map((opt) => (
            <label key={opt} className="block">
              <input
                type="checkbox"
                value={opt}
                checked={interests.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Get Suggestions"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 text-green-900 rounded">
          <h2 className="font-bold mb-2">Suggestion:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
