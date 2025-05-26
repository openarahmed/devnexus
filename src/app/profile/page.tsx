"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<{
    email?: string;
    answers?: Record<string, string>;
    suggestion?: string;
    interests?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load profile.");
      } else {
        setProfile(data);
      }
    } catch {
      setError("Error loading profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={loadProfile}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Loading..." : "Load Profile"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {profile && (
        <div className="mt-6">
          <p>
            <strong>Email:</strong> {profile.email}
          </p>

          <div className="mt-2">
            <p>
              <strong>Your Answers:</strong>
            </p>
            {profile.answers && Object.keys(profile.answers).length > 0 ? (
              <ul className="list-disc ml-6">
                {Object.entries(profile.answers).map(([key, val]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {val}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No answers saved.</p>
            )}
          </div>

          <div className="mt-2">
            <p>
              <strong>Career Suggestion:</strong>
            </p>
            <p>{profile.suggestion || "No suggestion available."}</p>
          </div>

          <div className="mt-2">
            <p>
              <strong>Your Interests:</strong>
            </p>
            {profile.interests && profile.interests.length > 0 ? (
              <ul className="list-disc ml-6">
                {profile.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p>No interests saved.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
