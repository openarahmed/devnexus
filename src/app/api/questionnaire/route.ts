/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/questionnaire/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "../../../models/user";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  HarmProbability,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";

// ✅ Your Gemini API Key — remove before production
const HARDCODED_GEMINI_API_KEY = "AIzaSyAsab15A619JWjkq4boPUOEHf4kIizxgWo";

export async function POST(request: Request) {
  const { email, answers, interests } = await request.json();

  if (!email || !answers || !interests) {
    return NextResponse.json(
      { message: "Email, answers, and interests are required." },
      { status: 400 }
    );
  }

  if (typeof answers !== "object" || Object.keys(answers).length === 0) {
    return NextResponse.json(
      { message: "Answers must be a non-empty object." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.answers = answers;
    if (Array.isArray(interests)) {
      user.interests = interests;
    }

    const apiKey = HARDCODED_GEMINI_API_KEY;

    if (!apiKey || apiKey.length < 30) {
      console.error("Gemini API key is missing or invalid.");
      user.suggestion = "AI suggestion service misconfigured. Answers saved.";
      user.isQuestionnaireCompleted = true;
      await user.save();
      return NextResponse.json(
        {
          suggestion: user.suggestion,
          message: "Answers saved, but AI service misconfigured.",
        },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an expert career advisor and learning path strategist for aspiring software developers.
      Based on the following user profile, generate a personalized and actionable career path suggestion and a brief learning roadmap.

      Format:
      **Suggested Career Path:** [Concise suggestion]

      **Learning Roadmap Highlights:**
      1.  **Core Skill 1:** [Skill] - [Why and topics]
      2.  **Core Skill 2:** [Skill] - [Why and topics]
      3.  **Specialization/Next Step:** [Step] - [Explanation]
      4.  **Project Idea:** [1–2 beginner/intermediate project ideas]

      Be practical and motivational.

      User Profile:
      - Primary Development Interest: ${answers.q1 || "Not specified"}
      - Preferred Work Style: ${answers.q2 || "Not specified"}
      - Programming Experience: ${answers.q3 || "Not specified"}
      - Projects Enjoyed: ${answers.q4 || "Not specified"}
      - Preferred Language: ${answers.q5 || "Not specified"}
      - Additional Interests: ${
        interests.length > 0 ? interests.join(", ") : "None"
      }
    `;

    let aiSuggestion = "Could not generate a suggestion. Answers saved.";

    try {
      const generationResult = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      const response = generationResult.response;

      if (response.promptFeedback?.blockReason) {
        aiSuggestion = `AI could not respond: ${response.promptFeedback.blockReason}.`;
        const harmful = response.promptFeedback.safetyRatings
          ?.filter(
            (r) =>
              r.probability === HarmProbability.MEDIUM ||
              r.probability === HarmProbability.HIGH
          )
          .map((r) => r.category.replace("HARM_CATEGORY_", ""))
          .join(", ");
        if (harmful) aiSuggestion += ` Issues detected: ${harmful}.`;
      } else {
        try {
          aiSuggestion = response.text().trim();
        } catch (err) {
          aiSuggestion = "AI response could not be parsed.";
        }
      }
    } catch (apiError) {
      console.error("[Gemini API Error]", apiError);
      aiSuggestion = "AI request failed. Answers saved.";
    }

    user.suggestion = aiSuggestion;
    user.isQuestionnaireCompleted = true;
    await user.save();

    return NextResponse.json({
      suggestion: user.suggestion,
      message: "Questionnaire submitted and AI suggestion processed.",
    });
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json(
      { message: "Server error.", errorDetails: (error as Error).message },
      { status: 500 }
    );
  }
}
