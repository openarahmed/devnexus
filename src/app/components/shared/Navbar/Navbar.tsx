// src/app/components/shared/Navbar/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Rocket,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserCircle,
} from "lucide-react"; // Added LayoutDashboard, LogOut, LogIn
import { useAuth } from "../../../../context/AuthContext"; // <<--- IMPORT useAuth
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth(); // <<--- GET AUTH STATE

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" }, // Assuming you have an ID 'features' on your homepage
    { href: "/questionnaire", label: "Questionnaire" }, // Your existing link
  ];

  // This will be replaced by conditional rendering
  // const authLinks = [
  //   { href: "/auth/login", label: "Login", primary: false },
  //   { href: "/auth/register", label: "Register", primary: true },
  // ];

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    // Basic loading state to prevent flash of incorrect auth links
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <Rocket className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-800">
                  DevNexus
                </span>
              </Link>
            </div>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <Rocket className="h-8 w-8 text-blue-600 group-hover:text-sky-500 transition-colors" />
              <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                DevNexus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 ease-in-out"
              >
                {item.label}
              </Link>
            ))}
            {/* Conditional Desktop Dashboard Link */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 ease-in-out flex items-center"
              >
                <LayoutDashboard size={20} className="mr-1.5" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Authentication Buttons / User Info */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <Link href="dashboard">
                    <span className="text-sm text-gray-700">
                      Hi, {user.name}!
                    </span>
                  </Link>
                )}
                <Link href="/dashboard">
                  <div className="flex items-center">
                    {user &&
                    typeof user.profilePictureUrl === "string" &&
                    user.profilePictureUrl.trim() !== "" ? (
                      <Image
                        src={user.profilePictureUrl} // TypeScript should be happier here
                        alt={user.name || "User profile picture"} // user.name since user is confirmed
                        width={40}
                        height={40}
                        className="rounded-full h-15 w-15 object-cover border-[3px] border-yellow-400"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <UserCircle size={40} className="text-blue-400 mr-3" />
                    )}
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 flex items-center"
                >
                  <LogOut size={16} className="mr-1.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login" // Points to your combined login/signup page
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 text-blue-600 hover:bg-gray-200 focus:ring-sky-500 border border-gray-200 flex items-center"
                >
                  <LogIn size={16} className="mr-1.5" />
                  Login
                </Link>
                <Link
                  href="/auth/register" // Example: Link directly to signup view on your auth page
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 flex items-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Animated */}
      <div
        className={`
          md:hidden absolute top-full inset-x-0 bg-white shadow-xl z-40 border-t border-gray-200
          overflow-hidden transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "max-h-[500px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }
        `}
      >
        <div className="px-4 pt-4 pb-5 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleMobileLinkClick}
              className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* Conditional Mobile Dashboard Link */}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              onClick={handleMobileLinkClick}
              className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
            >
              <LayoutDashboard size={20} className="mr-2" />
              Dashboard
            </Link>
          )}
          <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Hi, {user.name}!
                  </div>
                )}
                <button
                  onClick={() => {
                    logout();
                    handleMobileLinkClick();
                  }}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-semibold transition-colors bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth" // Link to your combined login/signup page
                  onClick={handleMobileLinkClick}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-semibold transition-colors bg-gray-100 text-blue-600 hover:bg-gray-200 border border-gray-200 flex items-center justify-center"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link
                  href="/auth?signup=true" // Example to pre-select signup form
                  onClick={handleMobileLinkClick}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
