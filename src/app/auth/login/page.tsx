// src/app/auth/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; // <<--- CORRECTED IMPORT PATH
import Head from "next/head";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login: contextLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("❌ Email and Password are required.");
      return;
    }

    let res;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");

        // IMPORTANT: Ensure responseData.user is the object sent by your API
        // It should contain id, email, name, and hasCompletedQuestionnaire
        if (responseData.user && typeof responseData.user === "object") {
          const userFromApi = responseData.user; // This should have all necessary fields
          const tokenFromApi = responseData.token; // If you use tokens

          console.log(
            "[AuthPage] Calling contextLogin with userFromApi:",
            userFromApi
          );
          contextLogin(userFromApi, tokenFromApi);
        } else {
          // This case means the API response was 'ok' but didn't include the expected user object.
          console.error(
            "[AuthPage] Login API response OK, but user data is missing or not an object:",
            responseData
          );
          setMessage(
            "❌ Login successful, but failed to retrieve user data. Please try again or contact support."
          );
        }
      } else {
        let errorMessage = `Error: ${res.status} ${res.statusText}`;
        if (responseData && responseData.message) {
          errorMessage = `❌ ${responseData.message}`;
        } else if (responseData && responseData.errorDetails) {
          // For your backend's error structure
          errorMessage = `❌ Server error: ${responseData.errorDetails}`;
        } else if (responseData && typeof responseData === "string") {
          errorMessage = `❌ ${responseData}`;
        } else {
          errorMessage = `❌ Login failed (Status: ${res.status}). No specific error message from server.`;
          console.error(
            "Login error response from server (unstructured):",
            responseData
          );
        }
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error("Login fetch/network error or JSON parsing error:", error);
      let finalMessage =
        "❌ Network error or an issue processing the server's response.";
      if (error instanceof SyntaxError && res && res.ok) {
        finalMessage =
          "✅ Login request seemed successful, but server sent an invalid response format.";
      } else if (res && !res.ok) {
        finalMessage = `❌ Error communicating with server (status: ${
          res.status || "unknown"
        }).`;
      }
      setMessage(finalMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Login - DevNexus</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login to DevNexus
          </h2>
          {message && (
            <p
              className={`mb-4 text-center text-sm p-3 rounded-md ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold text-base shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
