// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Settings,
  BarChart3,
  LogOutIcon,
  ExternalLink,
  Zap,
  ListChecks,
  AlertTriangle,
  Loader2,
  HelpCircle, // For Questionnaire
  Sparkles, // For AI Suggestion
  ChevronsRight,
  UserCircle, // For Interests
} from "lucide-react";
import Image from "next/image";

interface ProfileData {
  email?: string; // This will come from auth user, but API might also return it
  answers?: Record<string, string>;
  suggestion?: string;
  interests?: string[];
}

const DashboardPage: React.FC = () => {
  const { isAuthenticated, user, isLoading: authIsLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let pageTitle = "Dashboard - DevNexus";
    if (user?.name) {
      pageTitle = `Dashboard - ${user.name} - DevNexus`;
    } else if (user?.email) {
      pageTitle = `Dashboard - ${user.email} - DevNexus`;
    }
    document.title = pageTitle;

    if (!authIsLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, authIsLoading, router, user]);

  useEffect(() => {
    const fetchProfileData = async (email: string) => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          setProfileError(data.message || "Failed to load profile data.");
          setProfileData(null);
        } else {
          setProfileData(data);
        }
      } catch (err) {
        setProfileError("An error occurred while fetching profile data.");
        console.error("Fetch profile error:", err);
        setProfileData(null);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isAuthenticated && user?.email && !profileData && !profileLoading) {
      fetchProfileData(user.email);
    }
  }, [isAuthenticated, user, profileData, profileLoading]);

  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-lg">Loading User Session or Redirecting...</p>
      </div>
    );
  }

  const renderProfileLoadingError = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center text-gray-400 py-8 col-span-full">
          <Loader2 size={28} className="animate-spin mr-3" />
          Loading personalized insights...
        </div>
      );
    }
    if (profileError) {
      return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md flex items-start col-span-full">
          <AlertTriangle size={24} className="mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Could not load insights</h4>
            <p className="text-sm">{profileError}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto p-4 py-8 sm:p-8">
        <header className="mb-10 text-center sm:text-left border-b border-gray-700 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 flex items-center">
                <Zap
                  size={32}
                  className="mr-3 text-yellow-400 transform -rotate-12"
                />
                DevNexus Dashboard
              </h1>
              {user && (
                <p className="text-lg text-gray-400 mt-2">
                  Welcome back, {user.name || user.email}!
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors text-sm flex items-center self-center sm:self-auto"
            >
              <LogOutIcon size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* --- Top Row: Profile Info & Questionnaire Answers (2-column) --- */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Left Column: Profile Summary & Interests */}
          <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col">
            <div className="flex items-center mb-4">
              {user &&
              typeof user.profilePictureUrl === "string" &&
              user.profilePictureUrl.trim() !== "" ? (
                <Image
                  src={user.profilePictureUrl} // TypeScript should be happier here
                  alt={user.name || "User profile picture"} // user.name since user is confirmed
                  width={40}
                  height={40}
                  className="rounded-full h-15 w-15 mr-3 object-cover border-[5px] border-yellow-400"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <UserCircle size={40} className="text-blue-400 mr-3" />
              )}
              <h2 className="text-2xl font-semibold">Profile Summary</h2>
            </div>
            {user && (
              <ul className="space-y-1 text-gray-300 text-sm mb-4">
                {user.name && (
                  <li>
                    <strong>Name:</strong> {user.name}
                  </li>
                )}
                <li>
                  <strong>Email:</strong> {user.email}
                </li>
              </ul>
            )}
            <hr className="border-gray-700 my-4" />
            <div className="flex items-center mb-2">
              <ChevronsRight size={24} className="text-purple-400 mr-2" />
              <h3 className="text-xl font-medium text-gray-100">
                Identified Interests:
              </h3>
            </div>
            {profileLoading && !profileData && (
              <p className="text-gray-500 italic">Loading interests...</p>
            )}
            {profileData?.interests && profileData.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profileData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-purple-600/70 text-purple-100 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              !profileLoading && (
                <p className="text-gray-500 italic">
                  No specific interests identified yet.
                </p>
              )
            )}
            <div className="mt-auto pt-4">
              <button className="text-sm text-blue-400 hover:underline flex items-center">
                Edit Profile <ExternalLink size={14} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Questionnaire Answers */}
          <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex items-center mb-4">
              <HelpCircle size={36} className="text-teal-400 mr-3" />
              <h2 className="text-2xl font-semibold">Questionnaire Summary</h2>
            </div>
            {profileLoading && !profileData && (
              <p className="text-gray-500 italic">Loading answers...</p>
            )}
            {profileData?.answers &&
            Object.keys(profileData.answers).length > 0 ? (
              <ul className="list-inside space-y-2 text-sm text-gray-300 max-h-60 overflow-y-auto pr-2">
                {Object.entries(profileData.answers).map(([key, val]) => (
                  <li key={key} className="border-b border-gray-700 pb-1">
                    <strong className="text-gray-100">
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      :
                    </strong>{" "}
                    {String(val)}
                  </li>
                ))}
              </ul>
            ) : (
              !profileLoading && (
                <p className="text-gray-500 italic">
                  No answers found from your questionnaire.
                </p>
              )
            )}
            {profileError && !profileData && (
              <p className="text-red-400 italic">
                Could not load questionnaire answers.
              </p>
            )}
          </div>
        </div>

        {/* --- Middle Row: AI Career Suggestion (Full Width) --- */}
        {
          renderProfileLoadingError() /* Show general loading/error only if suggestion isn't specifically handled below */
        }
        {!profileLoading &&
          profileData && ( // Only render this section if profileData is loaded
            <section className="mb-10">
              <div className="bg-gradient-to-r from-blue-700/50 to-green-700/50 p-6 rounded-xl shadow-2xl border border-blue-600">
                <div className="flex items-start">
                  <Sparkles
                    size={36}
                    className="text-yellow-300 mr-4 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-yellow-200 mb-2">
                      AI Career Path Suggestion
                    </h2>
                    {profileData.suggestion ? (
                      <p className="text-lg text-gray-100 leading-relaxed">
                        {profileData.suggestion}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No career suggestion available yet. Complete your
                        questionnaire to get one!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

        {/* --- Bottom Row: Roadmap, Goals, Settings (Flexible Grid) --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Personalized Roadmap Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-green-500/20 transition-shadow duration-300 lg:col-span-2">
            <div className="flex items-center mb-4">
              <ListChecks size={36} className="text-green-400 mr-3" />
              <h2 className="text-2xl font-semibold">Your Learning Roadmap</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Based on your profile and AI suggestion, your detailed
              step-by-step learning path will be generated here.
            </p>
            <div className="border border-dashed border-gray-700 p-6 rounded-md text-center text-gray-500 mb-4 min-h-[150px] flex items-center justify-center">
              <p>
                Dynamic roadmap UI (e.g., using D3.js or a timeline library)
                will appear here.
              </p>
            </div>
            <button className="text-sm text-green-400 hover:underline flex items-center">
              View & Manage Roadmap <ExternalLink size={14} className="ml-1" />
            </button>
          </div>

          {/* Goals & Progress Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-yellow-500/20 transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <BarChart3 size={36} className="text-yellow-400 mr-3" />
              <h2 className="text-2xl font-semibold">Goals & Progress</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Track your learning goals and see your progress towards mastering
              your chosen path.
            </p>
            <div className="space-y-3 text-gray-300">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <p>Overall Roadmap Completion</p>
                  <p>30%</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <p>Current Module: React Basics</p>
                  <p>4/10 Lessons</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-400 h-2.5 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
            <button className="mt-4 text-sm text-yellow-400 hover:underline flex items-center">
              Update Progress <ExternalLink size={14} className="ml-1" />
            </button>
          </div>

          {/* Account Settings Card (can be kept or moved) */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-purple-500/20 transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Settings size={36} className="text-purple-400 mr-3" />
              <h2 className="text-2xl font-semibold">Account Settings</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Manage your account preferences and notification settings.
            </p>
            <button className="text-sm text-purple-400 hover:underline flex items-center">
              Go to Settings <ExternalLink size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
