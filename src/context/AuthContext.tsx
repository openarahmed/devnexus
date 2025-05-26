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
  email?: string;
  name?: string;
  hasCompletedQuestionnaire?: boolean;
  profilePictureUrl?: string; // <-- ADD THIS LINE
  // Add other fields your API might return for the user
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token?: string) => void;
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
        if (
          parsedUser &&
          typeof parsedUser.email === "string" &&
          parsedUser.email.trim() !== ""
        ) {
          setUser(parsedUser); // This will now include profilePictureUrl if stored
          setIsAuthenticated(true);
          userIsValidAndLoaded = true;
          console.log(
            "AuthContext: User successfully loaded from localStorage:",
            parsedUser
          );
        } else {
          console.warn(
            "AuthContext: User data in localStorage is invalid. Clearing.",
            parsedUser
          );
          localStorage.removeItem("devnexusUser");
        }
      } catch (e) {
        console.error(
          "AuthContext: Error parsing user from localStorage. Clearing.",
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
      "isAuthenticated (after load):",
      userIsValidAndLoaded
    );
  }, []);

  const login = (userData: User, token?: string) => {
    console.log("AuthContext: login function called with userData:", userData);
    if (
      !userData ||
      typeof userData.email !== "string" ||
      userData.email.trim() === ""
    ) {
      console.error(
        "AuthContext: Login attempt with invalid user data. Aborting.",
        userData
      );
      alert("Login failed: User data is incomplete. Email is missing.");
      return;
    }
    setUser(userData); // userData from login API should now include profilePictureUrl
    setIsAuthenticated(true);
    if (token) {
      localStorage.setItem("authToken", token);
    }
    localStorage.setItem("devnexusUser", JSON.stringify(userData)); // Store the complete user object
    console.log("AuthContext: User logged in and data stored. User:", userData);
    router.push("/dashboard");
  };

  const logout = () => {
    console.log("AuthContext: logout function called");
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("devnexusUser");
    console.log("AuthContext: User logged out. Navigating to /auth.");
    router.push("/auth");
  };

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
