/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Settings,
  BarChart3,
  LogOutIcon,
  ExternalLink,
  Zap,
  ListChecks,
  AlertTriangle,
  Loader2,
  HelpCircle,
  ChevronsRight,
} from "lucide-react";
import Image from "next/image";
import FormattedAiSuggestion from "../components/FormattedAiSuggestion";

interface ProfileData {
  email?: string;
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

  const parseSuggestion = (suggestionText: string | null | undefined) => {
    if (!suggestionText) return [];

    const sections: {
      title?: string;
      content?: string;
      items?: { title: string; description: string }[];
    }[] = [];
    let currentSection: {
      title?: string;
      content?: string;
      items?: { title: string; description: string }[];
    } | null = null;

    const lines = suggestionText
      .split("\n")
      .filter((line) => line.trim() !== "");

    lines.forEach((line) => {
      const careerPathMatch = line.match(
        /^\*\*Suggested Career Path:\*\*\s*(.*)/i
      );
      const roadmapHighlightsMatch = line.match(
        /^\*\*Learning Roadmap Highlights:\*\*/i
      );
      const listItemMatch = line.match(/^(\d+)\.\s*\*\*(.*?):\*\*\s*(.*)/);
      const projectIdeaMatch = line.match(
        /^\*\*(Project Idea(?:s)?):\*\*\s*(.*)/i
      );
      const generalListItemMatch = line.match(/^(\d+)\.\s*(.*?)\s*-\s*(.*)/);

      if (careerPathMatch) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: "Suggested Career Path",
          content: careerPathMatch[1].trim(),
        };
      } else if (roadmapHighlightsMatch) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: "Learning Roadmap Highlights", items: [] };
      } else if (listItemMatch && currentSection?.items) {
        currentSection.items.push({
          title: listItemMatch[2].trim(),
          description: listItemMatch[3].trim(),
        });
      } else if (projectIdeaMatch && currentSection?.items) {
        currentSection.items.push({
          title: projectIdeaMatch[1].trim(),
          description: projectIdeaMatch[2].trim(),
        });
      } else if (generalListItemMatch && currentSection?.items) {
        currentSection.items.push({
          title: generalListItemMatch[2].trim(),
          description: generalListItemMatch[3].trim(),
        });
      } else if (currentSection && currentSection.content) {
        currentSection.content += `\n${line}`;
      } else if (
        currentSection &&
        currentSection.items &&
        currentSection.items.length > 0
      ) {
        const lastItem = currentSection.items[currentSection.items.length - 1];
        lastItem.description += `\n${line}`;
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseSuggestion(profileData?.suggestion);

  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-lg">Loading User Session or Redirecting...</p>
      </div>
    );
  }

  const renderProfileLoadingError = () => {
    if (profileLoading && !profileData) {
      return (
        <div className="flex items-center justify-center text-gray-400 py-8 col-span-full">
          <Loader2 size={28} className="animate-spin mr-3" />
          Loading personalized insights...
        </div>
      );
    }
    if (profileError && !profileData) {
      return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md flex items-start col-span-full mb-10">
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

  const formatDescription = (description: string) => {
    const parts = description.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  const parseRoadmapItem = (description: string) => {
    const result: {
      importance?: string;
      keyTopics?: { tech?: string; items: string[] }[];
      learningResources?: string;
      estimatedTime?: string;
    } = { keyTopics: [] };

    // Extract Importance
    if (description.includes("Importance:")) {
      result.importance = description
        .split("Importance:")[1]
        .split("Key Topics:")[0]
        .trim();
    }

    // Extract Key Topics
    if (description.includes("Key Topics:")) {
      const keyTopicsSection = description
        .split("Key Topics:")[1]
        .split("Learning Resources")[0]
        .trim();

      // Split by technology if present (e.g., "HTML: semantics...")
      const techSections = keyTopicsSection
        .split(/([A-Za-z]+:)/g)
        .filter(Boolean);

      let currentTech = "";
      for (let i = 0; i < techSections.length; i++) {
        const section = techSections[i].trim();
        if (section.endsWith(":")) {
          currentTech = section.replace(":", "").trim();
        } else if (currentTech) {
          const items = section
            .split(/[,;]/g)
            .map((item) => item.trim())
            .filter(Boolean);
          result.keyTopics?.push({ tech: currentTech, items });
          currentTech = "";
        } else {
          // Handle topics without specific technology
          const items = section
            .split(/[,;]/g)
            .map((item) => item.trim())
            .filter(Boolean);
          result.keyTopics?.push({ items });
        }
      }
    }

    // Extract Learning Resources
    if (description.includes("Learning Resources")) {
      result.learningResources = description
        .split("Learning Resources & Practice:")[1]
        .split("Estimated Time:")[0]
        .trim();
    }

    // Extract Estimated Time
    if (description.includes("Estimated Time:")) {
      result.estimatedTime = description
        .split("Estimated Time:")[1]
        .split("\n")[0]
        .trim();
    }

    return result;
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

        {renderProfileLoadingError()}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col">
            <div className="flex items-center mb-4">
              {user &&
              typeof (user as any).profilePictureUrl === "string" &&
              (user as any).profilePictureUrl.trim() !== "" ? (
                <Image
                  src={(user as any).profilePictureUrl}
                  alt={user.name || "User profile picture"}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 mr-3 object-cover border-2 border-yellow-400"
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
            {profileLoading && !profileData?.interests && (
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

          <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex items-center mb-4">
              <HelpCircle size={36} className="text-teal-400 mr-3" />
              <h2 className="text-2xl font-semibold">Questionnaire Summary</h2>
            </div>
            {profileLoading && !profileData?.answers && (
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
            {profileError && !profileData?.answers && (
              <p className="text-red-400 italic">
                Could not load questionnaire answers.
              </p>
            )}
          </div>
        </div>

        {(profileData || profileLoading || profileError) && (
          <section className="mb-10">
            {profileLoading && !profileData && (
              <div className="flex items-center justify-center text-gray-400 py-8">
                <Loader2 size={28} className="animate-spin mr-3" />
                Loading AI Suggestion...
              </div>
            )}
            {profileError && !profileData && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
                <AlertTriangle size={24} className="mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">
                    Could not load AI Suggestion
                  </h4>
                  <p className="text-sm">{profileError}</p>
                </div>
              </div>
            )}

            {profileData && !profileError && (
              <div className="bg-gradient-to-r from-blue-800/60 via-blue-700/50 to-green-800/60 p-6 rounded-xl shadow-2xl border border-blue-700">
                <FormattedAiSuggestion
                  suggestionText={profileData.suggestion}
                />
              </div>
            )}
          </section>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-green-500/20 transition-shadow duration-300 lg:col-span-2">
            <div className="flex items-center mb-4">
              <ListChecks size={36} className="text-green-400 mr-3" />
              <h2 className="text-2xl font-semibold">
                Your Learning Roadmap Visualizer
              </h2>
            </div>

            {profileLoading ? (
              <div className="flex items-center justify-center text-gray-400 py-8">
                <Loader2 size={28} className="animate-spin mr-3" />
                Loading roadmap...
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-4">
                  {profileData?.suggestion
                    ? "Based on your profile and AI suggestion, here's your personalized learning path:"
                    : "Complete your questionnaire to generate a personalized learning roadmap."}
                </p>

                {(() => {
                  const roadmapSection = sections.find((s) =>
                    s.title?.includes("Learning Roadmap Highlights")
                  );

                  return roadmapSection?.items ? (
                    <div className="space-y-6">
                      {roadmapSection.items.map((item, index) => {
                        const parsedItem = parseRoadmapItem(item.description);

                        return (
                          <div
                            key={index}
                            className="border-l-4 border-green-500 pl-4 py-3 bg-gray-700/30 rounded-r hover:bg-gray-700/50 transition-colors"
                          >
                            <h4 className="font-semibold text-green-300 text-lg">
                              {item.title.replace(/\*\*/g, "")}
                            </h4>

                            {parsedItem.importance && (
                              <div className="mt-2">
                                <h5 className="font-medium text-gray-200 mb-1">
                                  Importance:
                                </h5>
                                <p className="text-gray-300 text-sm">
                                  {formatDescription(parsedItem.importance)}
                                </p>
                              </div>
                            )}

                            {parsedItem.keyTopics &&
                              parsedItem.keyTopics.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="font-medium text-gray-200 mb-1">
                                    Key Topics:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {parsedItem.keyTopics.map((topic, i) => (
                                      <div
                                        key={i}
                                        className="bg-gray-800/50 p-3 rounded"
                                      >
                                        {topic.tech && (
                                          <h6 className="font-semibold text-blue-300 text-sm mb-1">
                                            {topic.tech}
                                          </h6>
                                        )}
                                        <ul className="list-disc pl-5 text-gray-300 text-xs space-y-1">
                                          {topic.items.map((item, j) => (
                                            <li key={j}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {parsedItem.learningResources && (
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-200 mb-1">
                                  Learning Resources & Practice:
                                </h5>
                                <p className="text-gray-300 text-sm whitespace-pre-line">
                                  {formatDescription(
                                    parsedItem.learningResources
                                  )}
                                </p>
                              </div>
                            )}

                            {parsedItem.estimatedTime && (
                              <div className="mt-2 text-xs text-blue-300">
                                <strong>Estimated Time:</strong>{" "}
                                {parsedItem.estimatedTime}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-700 p-6 rounded-md text-center text-gray-500 mb-4 min-h-[150px] flex items-center justify-center">
                      <p>
                        {profileData
                          ? "No roadmap items found in your suggestion."
                          : "Complete your questionnaire to generate a personalized learning roadmap."}
                      </p>
                    </div>
                  );
                })()}
              </>
            )}

            <button className="mt-4 text-sm text-green-400 hover:underline flex items-center">
              View & Manage Roadmap <ExternalLink size={14} className="ml-1" />
            </button>
          </div>

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
