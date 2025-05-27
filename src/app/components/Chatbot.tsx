// src/components/Chatbot.tsx
"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { Send, User, Bot, Loader2, XCircle } from "lucide-react";

interface ChatMessagePart {
  text: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  parts: ChatMessagePart[];
  error?: boolean;
  isTyping?: boolean; // For AI typing indicator
}

interface ChatbotProps {
  onClose?: () => void;
  isVisible?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, isVisible }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API call
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const typeAiResponse = (
    fullResponseText: string,
    isError: boolean = false
  ) => {
    let currentText = "";
    const typingSpeed = 25; // Milliseconds per character, adjust for desired speed

    const aiTypingMessageId = Date.now().toString() + "-model-typing";
    setChatHistory((prev) => [
      ...prev,
      {
        id: aiTypingMessageId,
        role: "model",
        parts: [{ text: "" }],
        isTyping: true,
        error: isError, // Pass error status for styling
      },
    ]);

    let charIndex = 0;
    const intervalId = setInterval(() => {
      if (charIndex < fullResponseText.length) {
        currentText += fullResponseText[charIndex];
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiTypingMessageId
              ? { ...msg, parts: [{ text: currentText + "▋" }] } // Blinking cursor
              : msg
          )
        );
        charIndex++;
      } else {
        clearInterval(intervalId);
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiTypingMessageId
              ? { ...msg, parts: [{ text: currentText }], isTyping: false }
              : msg
          )
        );
      }
    }, typingSpeed);
  };

  const handleSendMessage = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      role: "user",
      parts: [{ text: trimmedMessage }],
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true); // For the API call itself

    try {
      const historyToSend = chatHistory
        .filter((msg) => !msg.isTyping) // Don't send incomplete typing messages as history
        .slice(-10) // Send last 10 actual messages
        .map((msg) => ({
          role: msg.role,
          parts: msg.parts,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMessage,
          history: historyToSend,
        }),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to get a valid error response from AI.",
        }));
        throw new Error(errorData.error || "AI service returned an error.");
      }

      const data = await response.json();
      if (data.reply) {
        typeAiResponse(data.reply);
      } else {
        typeAiResponse("Sorry, I didn't get a proper response.", true);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Chatbot error:", error);
      const errorMessageText =
        error instanceof Error
          ? error.message
          : "Sorry, I couldn't connect to the AI assistant.";
      typeAiResponse(errorMessageText, true); // Type out error messages too
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-h-[600px] w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl rounded-xl border dark:border-gray-700 mx-auto my-10">
      <header className="bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-700 dark:to-sky-600 text-white p-4 flex justify-between items-center rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Bot size={22} />
          <h2 className="text-lg font-bold">DevNexus AI Advisor</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <XCircle size={24} />
          </button>
        )}
      </header>

      <div
        ref={chatContainerRef}
        className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto bg-gray-100 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {chatHistory.length === 0 && !isLoading && (
          <div className="flex justify-start mb-2 animate-fadeIn">
            <div className="p-3 rounded-lg max-w-[85%] bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 shadow">
              <div className="flex items-start space-x-3">
                <Bot size={24} className="flex-shrink-0 mt-0.5 text-blue-500" />
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  Hello! Im your DevNexus AI Advisor. Ask me anything about your
                  career goals, learning paths, or tech stacks!
                </p>
              </div>
            </div>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full animate-fadeIn ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`py-2.5 px-4 rounded-2xl max-w-[85%] shadow-md ${
                msg.role === "user"
                  ? "bg-blue-500 text-white dark:bg-blue-600 ml-auto rounded-br-lg"
                  : msg.error
                  ? "bg-red-100 text-red-700 dark:bg-red-800/70 dark:text-red-200 border border-red-300 dark:border-red-600 rounded-bl-lg"
                  : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200 mr-auto rounded-bl-lg"
              }`}
            >
              <div
                className={`flex items-start space-x-2.5 ${
                  msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {msg.role === "model" && (
                  <Bot
                    size={20}
                    className={`flex-shrink-0 mt-1 ${
                      msg.error
                        ? "text-red-500 dark:text-red-300"
                        : "text-blue-500 dark:text-blue-400"
                    }`}
                  />
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.parts[0].text}
                </p>
                {msg.role === "user" && (
                  <User size={20} className="flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          </div>
        ))}
        {/* This is the API call loading, not the typing indicator */}
        {isLoading && !chatHistory.some((m) => m.isTyping) && (
          <div className="flex justify-start animate-fadeIn">
            <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400 max-w-[80%]">
              <div className="flex items-start space-x-2">
                <Bot size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex space-x-1 items-center pt-1">
                  <span
                    className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce "
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t bg-white dark:border-gray-700 dark:bg-gray-800 rounded-b-xl"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about tech careers, skills, etc..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
            disabled={isLoading || chatHistory.some((m) => m.isTyping)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent newline in input on Enter
                if (
                  !isLoading &&
                  !chatHistory.some((m) => m.isTyping) &&
                  inputMessage.trim()
                ) {
                  handleSendMessage();
                }
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 shadow-md flex items-center justify-center"
            disabled={
              isLoading ||
              !inputMessage.trim() ||
              chatHistory.some((m) => m.isTyping)
            }
            aria-label="Send message"
          >
            {isLoading || chatHistory.some((m) => m.isTyping) ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
