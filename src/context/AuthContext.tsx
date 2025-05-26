// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  email?: string; // Essential for profile fetching on dashboard
  name?: string;
  hasCompletedQuestionnaire?: boolean; // As seen in your logs
  // Add other fields your API might return for the user
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token?: string) => void; // token is optional
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthContext: Initializing authentication state...");
    const storedUserString = localStorage.getItem("devnexusUser");
    let userIsValidAndLoaded = false;

    if (storedUserString) {
      try {
        const parsedUser: User = JSON.parse(storedUserString);
        // CRITICAL CHECK: Ensure the parsed user has a valid, non-empty email.
        if (
          parsedUser &&
          typeof parsedUser.email === "string" &&
          parsedUser.email.trim() !== ""
        ) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          userIsValidAndLoaded = true;
          console.log(
            "AuthContext: User successfully loaded from localStorage:",
            parsedUser
          );
        } else {
          console.warn(
            "AuthContext: User data in localStorage is invalid (missing or empty email). Clearing stored user.",
            parsedUser
          );
          localStorage.removeItem("devnexusUser");
        }
      } catch (e) {
        console.error(
          "AuthContext: Error parsing user from localStorage. Clearing stored user.",
          e
        );
        localStorage.removeItem("devnexusUser");
      }
    } else {
      console.log("AuthContext: No 'devnexusUser' found in localStorage.");
    }

    setIsLoading(false);
    console.log(
      "AuthContext: Initialization complete. isLoading:",
      false,
      "isAuthenticated (after attempt to load):",
      userIsValidAndLoaded
    );
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = (userData: User, token?: string) => {
    // token example, adapt if you use it
    console.log("AuthContext: login function called with userData:", userData);
    // CRITICAL CHECK: Ensure userData for login has a valid, non-empty email.
    if (
      !userData ||
      typeof userData.email !== "string" ||
      userData.email.trim() === ""
    ) {
      console.error(
        "AuthContext: Login attempt with invalid user data (missing or empty email). Aborting login.",
        userData
      );
      // Optionally, provide user feedback here if this happens (e.g., throw an error, set an error state)
      // For now, we'll just prevent login to avoid issues.
      alert("Login failed: User data is incomplete. Email is missing."); // Basic feedback
      return;
    }
    setUser(userData);
    setIsAuthenticated(true);
    if (token) {
      localStorage.setItem("authToken", token); // Example for token storage
    }
    localStorage.setItem("devnexusUser", JSON.stringify(userData));
    console.log(
      "AuthContext: User logged in and data stored. Navigating to dashboard. User:",
      userData
    );
    router.push("/dashboard");
  };

  const logout = () => {
    console.log("AuthContext: logout function called");
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken"); // Example for token removal
    localStorage.removeItem("devnexusUser");
    console.log("AuthContext: User logged out. Navigating to /auth.");
    router.push("/auth"); // Or your login page
  };

  // Optional: Log state changes for easier debugging during development
  useEffect(() => {
    console.log(
      "AuthContext State Update | isLoading:",
      isLoading,
      "| isAuthenticated:",
      isAuthenticated,
      "| user:",
      user
    );
  }, [isLoading, isAuthenticated, user]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
