// Example: app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head"; // If you want to set the page title

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!name.trim()) {
      setMessage("❌ Name is required.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      profilePictureUrl: profilePictureUrl.trim() || undefined, // Send undefined if empty after trim
    };

    // ---- FRONTEND LOG: See what is being sent ----
    console.log("[RegisterPage Frontend] Sending payload to API:", payload);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          data.message || "✅ Registration successful! Redirecting to login..."
        );
        // You might want to auto-login here using data.user and your AuthContext
        // For now, redirecting to login after a short delay
        setTimeout(() => {
          router.push("/auth"); // Or your login page path
        }, 2000);
      } else {
        setMessage(
          data.message ||
            data.errorDetails ||
            `❌ Registration failed (Status: ${res.status})`
        );
      }
    } catch (error) {
      console.error("Registration form submission error:", error);
      setMessage("❌ An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - DevNexus</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 text-black">
        {" "}
        {/* Ensure inputs are visible */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Your DevNexus Account
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
            <label
              htmlFor="nameInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="nameInput"
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="emailInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="emailInput"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="passwordInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              placeholder="Create a password (min. 6 characters)"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="profilePictureUrlInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Picture URL (Optional)
            </label>
            <input
              id="profilePictureUrlInput"
              type="url"
              placeholder="https://example.com/your-image.png"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold text-base shadow-md hover:shadow-lg disabled:bg-gray-400"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}
