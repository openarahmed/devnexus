import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  ChatSession,
  Content,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash-latest";

const SYSTEM_PROMPT = `You are DevNexus AI, a friendly, encouraging, and knowledgeable career assistant specifically for software developers and those aspiring to be. Your primary goal is to help users explore career paths, understand technologies, and find learning resources. Answer questions about programming languages (like Python, JavaScript, Java, C#, Go, Rust), job roles (Frontend Developer, Backend Developer, Fullstack Developer, AI Engineer, DevOps Engineer, Mobile Developer), tech stacks (MERN, MEAN, etc.), learning strategies, interview preparation, and project ideas.

When providing advice:
- Be practical and actionable.
- If suggesting technologies or learning paths, briefly explain why they are relevant.
- If asked for resources, you can suggest types of resources (e.g., "official documentation," "interactive coding platforms," "community forums") but avoid hallucinating specific URLs unless you are highly confident.
- Keep your responses helpful and aim for a balance between conciseness and informativeness.
- If you don't know an answer or if a question is outside your scope as a developer career assistant, it's okay to say so politely.
- Do not use markdown formatting like bolding (e.g., **text**) or lists (e.g., 1. Item) in your replies. Provide plain text answers. If the user asks for a list, you can present it with simple newlines.
- If the user's query seems vague, you can ask clarifying questions.
Okay, I understand my role.
`;

// ✅ Hardcoded API Key for testing
const apiKey = "AIzaSyAsab15A619JWjkq4boPUOEHf4kIizxgWo";

export async function POST(request: Request) {
  const { message, history } = await request.json();

  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const formattedHistory: Content[] = history
      ? history.map((item: { role: string; parts: { text: string }[] }) => ({
          role: item.role,
          parts: item.parts.map((part) => ({ text: part.text })),
        }))
      : [];

    const chat: ChatSession = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        {
          role: "model",
          parts: [
            {
              text: "Great! How can I help you explore your developer career today?",
            },
          ],
        },
        ...formattedHistory,
      ],
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
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

    console.log(
      `[Chat API] Sending to Gemini: "${message}" with history length: ${formattedHistory.length}`
    );
    const result = await chat.sendMessage(message);
    const response = result.response;

    let aiResponseText =
      "Sorry, I encountered an issue processing your request.";

    if (response.promptFeedback?.blockReason) {
      console.error(
        "Gemini prompt was blocked:",
        response.promptFeedback.blockReason,
        response.promptFeedback.safetyRatings
      );
      aiResponseText = `I'm sorry, but I can't respond to that due to content safety filters (${response.promptFeedback.blockReason}). Could you try rephrasing?`;
    } else if (
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content
    ) {
      aiResponseText = response.text();
    } else {
      console.error(
        "Gemini response was empty or filtered. Full response:",
        JSON.stringify(response, null, 2)
      );
      const finishReason = response.candidates?.[0]?.finishReason;
      if (
        finishReason &&
        finishReason !== "STOP" &&
        finishReason !== "MAX_TOKENS"
      ) {
        aiResponseText = `I couldn't generate a full response (Reason: ${finishReason}). Please try asking differently.`;
      }
    }

    console.log(
      `[Chat API] Gemini Response: "${aiResponseText.substring(0, 60)}..."`
    );
    return NextResponse.json({ reply: aiResponseText });
  } catch (error) {
    console.error("[CHAT_API_ERROR]", error);
    let errorMessage = "An error occurred with the AI chat service.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
