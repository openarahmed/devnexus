// src/app/api/questionnaire/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "../../../models/user"; // Ensure this path points to your User model
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  HarmProbability,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash-latest";

export async function POST(request: Request) {
  const {
    email,
    answers, // This object will contain keys like "q1_tech_excitement", "q2_work_focus", etc.
    interests: payloadInterests, // This should be the array from answers.q9_topics_of_interest
  } = await request.json();

  if (!email || !answers) {
    // payloadInterests can be an empty array, so not strictly required for this initial check
    return NextResponse.json(
      { message: "Email and answers are required." },
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

    user.answers = answers; // Save the new answers object
    // Ensure interests are correctly derived and saved
    if (Array.isArray(payloadInterests)) {
      user.interests = payloadInterests;
    } else if (
      answers.q9_topics_of_interest && // Assuming this is the ID for your interests question
      Array.isArray(answers.q9_topics_of_interest)
    ) {
      user.interests = answers.q9_topics_of_interest as string[];
    } else {
      user.interests = []; // Default if not provided correctly
    }

    const apiKey = process.env.GEMINI_API_KEY; // Using environment variable

    if (!apiKey || apiKey.length < 30) {
      // Basic validation for API key
      console.error(
        "Gemini API key is missing or invalid from environment variable (GEMINI_API_KEY)."
      );
      user.suggestion =
        "AI suggestion service is misconfigured (API Key issue). Answers saved.";
      user.isQuestionnaireCompleted = true;
      await user.save();
      return NextResponse.json(
        {
          suggestion: user.suggestion,
          message:
            "Questionnaire answers saved, but AI service misconfigured due to API key.",
        },
        { status: 503 }
      );
    }
    console.log(
      "[API Key Check] GEMINI_API_KEY found and seems valid. Proceeding."
    );

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // --- UPDATED PROMPT TO MATCH NEW GENERAL QUESTION IDS ---
    const prompt = `
      You are DevNexus AI, an expert career advisor and learning path strategist for aspiring software developers.
      Based on the following user profile, generate a personalized and actionable career path suggestion and a detailed learning roadmap.

      The output MUST follow this format strictly:
      **Suggested Career Path:** [Provide a concise and specific career path title. For example: "Fullstack Developer with a specialization in E-commerce using MERN stack"]

      **Learning Roadmap Highlights:**
      1.  **Phase 1: Foundational Knowledge - [Technology/Skill Name, e.g., HTML, CSS, & JavaScript Basics]** - Importance: [Briefly explain why this phase is crucial for the suggested path]. Key Topics: [List specific sub-topics to learn. For HTML: semantics, forms, accessibility basics. For CSS: selectors, box model, Flexbox, Grid, responsive design principles, basic animations. For JavaScript: variables, data types, functions, DOM manipulation, events, ES6+ features, async/await.]. Learning Resources & Practice: [Suggest types of resources like interactive tutorials, official docs, and a very small project idea for this phase, e.g., "Build a personal portfolio page."]. Estimated Time: [e.g., 4-6 weeks]
      2.  **Phase 2: Core Technology/Framework - [Technology/Framework Name, e.g., React.js for Frontend]** - Importance: [Explain its relevance to the career path]. Key Topics: [List specific sub-topics, e.g., components, props, state, hooks, routing, context API, testing basics]. Learning Resources & Practice: [Suggest types of resources and a small project, e.g., "Develop a dynamic To-Do List application."]. Estimated Time: [e.g., 6-8 weeks]
      3.  **Phase 3: Backend/Specialization - [Technology/Skill Name, e.g., Node.js & Express for Backend APIs]** - Importance: [Explain its role]. Key Topics: [e.g., RESTful API design, middleware, database integration (MongoDB with Mongoose), authentication, error handling]. Learning Resources & Practice: [e.g., "Build a simple API for a blog or a note-taking app."]. Estimated Time: [e.g., 6-8 weeks]
      4.  **Phase 4: Advanced Topics & Portfolio Building - [e.g., Fullstack Integration & Deployment]** - Importance: [Why this ties everything together]. Key Topics: [e.g., Connecting frontend to backend, state management across full stack, version control (Git/GitHub), testing (unit, integration), basic DevOps (Docker, CI/CD), deployment to a platform like Vercel or Netlify]. Learning Resources & Practice: [Suggest a more complex portfolio project, e.g., "A mini e-commerce site with user auth and product listings."]. Estimated Time: [e.g., 8-12 weeks]
      5.  **Phase 5: Continuous Learning & Career Preparation** - Importance: [Staying updated and job readiness]. Key Topics: [Data structures & algorithms basics, networking with other developers, contributing to open source, preparing a resume/portfolio, interview practice]. Learning Resources & Practice: [e.g., "Solve LeetCode easy problems, attend meetups (virtual or local)."]. Estimated Time: [Ongoing]
      
      Your primary goal is to provide a clear, step-by-step, and detailed guide. Be practical and motivational.
      The user's profile will help you tailor the technologies and focus within these phases.

      User Profile Details:
      - Tech Excitement: ${
        answers.q1_tech_excitement && Array.isArray(answers.q1_tech_excitement)
          ? (answers.q1_tech_excitement as string[]).join(", ")
          : "Not specified"
      }
      - Preferred Work Focus: ${answers.q2_work_focus || "Not specified"}
      - Online Learning Experience: ${
        answers.q3_online_learning || "Not specified"
      }
      - Creation Aspirations: ${
        answers.q4_creation_dream && Array.isArray(answers.q4_creation_dream)
          ? (answers.q4_creation_dream as string[]).join(", ")
          : "Not specified"
      }
      - Preferred Learning Style: ${
        answers.q5_learning_style_preference || "Not specified"
      }
      - Teamwork Preference: ${
        answers.q6_teamwork_preference || "Not specified"
      }
      - Dream Work Environment: ${
        answers.q7_dream_work_environment || "Not specified"
      }
      - Weekly Learning Time Commitment: ${
        answers.q8_weekly_learning_time || "Not specified"
      }
      - Topics of Interest for Exploration: ${
        payloadInterests &&
        Array.isArray(payloadInterests) &&
        payloadInterests.length > 0
          ? payloadInterests.join(", ")
          : "None specified"
      }
      - Prior Tech Exposure: ${
        answers.q10_prior_tech_exposure || "Not specified"
      }
      - Preferred Language for Learning (Bonus): ${
        answers.q11_learning_language || "Not specified"
      }
      - 1-2 Year Goals (Bonus): ${
        answers.q12_short_term_goals || "Not specified"
      }

      Provide only the suggested path and roadmap highlights as per the detailed format above. Ensure each phase in the roadmap is clearly numbered and includes Importance, Key Topics, Learning Resources & Practice, and Estimated Time.
    `;
    // --- END OF PROMPT UPDATE ---

    let aiSuggestion =
      "Could not generate a suggestion at this time. Your answers have been saved.";

    try {
      const generationConfig = {
        temperature: 0.6,
        topK: 20,
        topP: 0.9,
        maxOutputTokens: 1500,
      };
      const safetySettings = [
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
      ];

      console.log(
        "[Gemini API] Sending detailed prompt for email:",
        email,
        "with answers:",
        JSON.stringify(answers, null, 2)
      );
      const generationResult = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = generationResult.response;
      console.log(
        "[Gemini API] Raw response object received:",
        JSON.stringify(response, null, 2)
      );

      if (response.promptFeedback?.blockReason) {
        console.error(
          "Prompt was blocked by Gemini API:",
          response.promptFeedback.blockReason,
          "Details:",
          response.promptFeedback.safetyRatings
        );
        aiSuggestion = `Your request could not be processed by the AI due to content safety filters: ${response.promptFeedback.blockReason}. Please try rephrasing your inputs.`;
        if (
          response.promptFeedback.safetyRatings &&
          response.promptFeedback.safetyRatings.length > 0
        ) {
          const harmfulCategories = response.promptFeedback.safetyRatings
            .filter(
              (rating) =>
                rating.probability === HarmProbability.MEDIUM ||
                rating.probability === HarmProbability.HIGH
            )
            .map((rating) =>
              rating.category.toString().replace("HARM_CATEGORY_", "")
            )
            .join(", ");
          if (harmfulCategories)
            aiSuggestion += ` Detected issues with: ${harmfulCategories}.`;
        }
      } else {
        try {
          const text = response.text();
          if (text && text.trim() !== "") {
            aiSuggestion = text.trim();
            console.log(
              "[Gemini API] Suggestion generated successfully (first 100 chars):",
              aiSuggestion.substring(0, 100) + "..."
            );
          } else {
            console.warn(
              "[Gemini API] response.text() returned empty or whitespace. Checking candidates..."
            );
            if (response.candidates && response.candidates.length > 0) {
              const firstCandidate = response.candidates[0];
              if (
                firstCandidate.finishReason &&
                firstCandidate.finishReason !== "STOP" &&
                firstCandidate.finishReason !== "MAX_TOKENS"
              ) {
                aiSuggestion = `AI could not complete generation (Reason: ${firstCandidate.finishReason}). Your answers have been saved.`;
                if (
                  firstCandidate.safetyRatings &&
                  firstCandidate.safetyRatings.length > 0
                ) {
                  const harmfulCategories = firstCandidate.safetyRatings
                    .filter(
                      (rating) =>
                        rating.probability === HarmProbability.MEDIUM ||
                        rating.probability === HarmProbability.HIGH
                    )
                    .map((rating) =>
                      rating.category.toString().replace("HARM_CATEGORY_", "")
                    )
                    .join(", ");
                  if (harmfulCategories)
                    aiSuggestion += ` Detected issues with: ${harmfulCategories}.`;
                }
              } else if (
                firstCandidate.content &&
                firstCandidate.content.parts &&
                firstCandidate.content.parts[0]?.text
              ) {
                aiSuggestion = firstCandidate.content.parts[0].text.trim();
                console.log(
                  "[Gemini API] Used text from first candidate:",
                  aiSuggestion.substring(0, 100) + "..."
                );
              } else {
                aiSuggestion =
                  "AI generated an empty response or content was filtered. Your answers have been saved.";
              }
            } else {
              aiSuggestion =
                "AI generated an empty response. Your answers have been saved.";
            }
          }
        } catch (textExtractionError) {
          console.error(
            "[Gemini API] Error extracting text from response...",
            textExtractionError
          );
          aiSuggestion = `AI could not generate a readable suggestion (possibly filtered). Your answers have been saved.`;
        }
      }
    } catch (apiError) {
      console.error("[Gemini API Error]", apiError);
      aiSuggestion = "AI request failed. Answers saved.";
    }

    user.suggestion = aiSuggestion;
    user.isQuestionnaireCompleted = true;
    await user.save();

    console.log(
      "[User Save] Final suggestion saved to DB:",
      user.suggestion
        ? user.suggestion.substring(0, 100) + "..."
        : "No suggestion saved"
    );
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
