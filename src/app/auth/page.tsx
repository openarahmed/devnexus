// src/app/auth/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Ensure path is correct
import Head from "next/head";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login: contextLogin, isLoading: authIsLoading } = useAuth(); // Added authIsLoading for button state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("❌ Email and Password are required.");
      return;
    }

    let res; // Define res here to access it in catch block if needed
    try {
      res = await fetch("/api/auth/login", {
        // YOUR BACKEND LOGIN ENDPOINT
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await res.json(); // Always try to parse JSON

      if (res.ok) {
        setMessage("✅ Login successful!");

        // EXPECTING responseData.user from your backend API
        if (
          responseData.user &&
          typeof responseData.user === "object" &&
          responseData.user.email
        ) {
          // Added check for responseData.user.email here for frontend robustness
          const userFromApi = responseData.user;
          const tokenFromApi = responseData.token; // If you use tokens

          console.log(
            "[AuthPage] Calling contextLogin with userFromApi:",
            userFromApi // <<< INSPECT THIS OBJECT IN YOUR CONSOLE
          );
          contextLogin(userFromApi, tokenFromApi); // This calls auth.login()
        } else {
          console.error(
            "[AuthPage] Login API response OK, but user data (with email) is missing or not an object:",
            responseData
          );
          setMessage(
            "❌ Login successful, but failed to retrieve complete user data. Please contact support."
          );
        }
      } else {
        // Handle non-ok responses (4xx, 5xx errors)
        let errorMessage = `Error: ${res.status}`;
        if (responseData && responseData.message) {
          errorMessage = `❌ ${responseData.message}`;
        } else {
          errorMessage = `❌ Login failed (Status: ${res.status}).`;
        }
        setMessage(errorMessage);
        console.error("[AuthPage] Login API error response:", responseData);
      }
    } catch (error) {
      console.error(
        "[AuthPage] Login fetch/network error or JSON parsing error:",
        error
      );
      setMessage("❌ Network error or issue processing the server's response.");
    }
  };

  return (
    <>
      <Head>
        <title>Login - DevNexus</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 text-black">
        {" "}
        {/* Added text-black for inputs */}
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
            disabled={authIsLoading} // Disable button while auth context is processing login/logout
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold text-base shadow-md hover:shadow-lg disabled:bg-gray-400"
          >
            {authIsLoading ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
