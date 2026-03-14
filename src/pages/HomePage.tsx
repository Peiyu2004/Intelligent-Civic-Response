import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessagesSquare,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // const { isAuthenticated, logout } = useAuth();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      if (user.role === "user") {
        // If user is authenticated and role is user
        window.location.href = "/zar/report.html";
      } else if (user.role === "admin") {
        // If user is authenticated and role is admin
        navigate("/dashboard");
      }
    } else {
      // If not authenticated, go to login
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="w-full bg-cover bg-center relative flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/assets/kl-city.png')",
        backgroundAttachment: "fixed",
        // minHeight: "1200px",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Navbar */}
      <div className="relative flex justify-center pt-6">
        <div className="w-[90%] md:w-[85%] bg-white/70 backdrop-blur-md rounded-full px-6 py-5 flex justify-between items-center shadow-lg">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          >
            <MessagesSquare className="w-8 h-8 md:w-10 md:h-10 text-white-600" />
            <span className="text-gray-800 font-bold text-xl md:text-3xl">
              CiviScan
            </span>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                {/* <button
                  onClick={() => navigate("/dashboard")}
                  className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition"
                >
                  Dashboard
                </button> */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-3 rounded-full font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="text-gray-700 hover:text-gray-900 font-medium px-4 py-3 rounded-full hover:bg-white/50 transition"
                >
                  Login/Register
                </button>
                {/* <button
                  onClick={handleGetStarted}
                  className="bg-white hover:bg-gray-100 text-gray-800 px-4 md:px-6 py-3 rounded-full font-medium shadow transition"
                >
                  Get Started
                </button> */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center text-white px-4 py-12">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 drop-shadow-lg leading-tight">
          INTELLIGENT <br className="hidden md:block" /> CIVIC RESPONSE
        </h1>

        <p className="text-lg md:text-2xl mb-12 drop-shadow-md max-w-2xl">
          Report infrastructure issues to help improve the city
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 md:px-14 py-4 md:py-7 rounded-full text-xl md:text-4xl font-bold shadow-xl hover:shadow-2xl transition transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Divider */}
      <div className="relative border-t border-white/50 mx-4 md:mx-10"></div>

      {/* Footer */}
      <footer className="relative bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-center text-white text-sm md:text-lg px-6 md:px-10 py-8 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            <span className="font-bold text-2xl md:text-3xl">CiviScan</span>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="font-semibold mb-2">About Us</p>
            <p className="text-sm md:text-base opacity-80">
              Home | Terms | Privacy | Contact
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Instagram className="w-6 h-6 md:w-8 md:h-8 cursor-pointer hover:opacity-80 hover:scale-110 transition" />
            <Facebook className="w-6 h-6 md:w-8 md:h-8 cursor-pointer hover:opacity-80 hover:scale-110 transition" />
            <Twitter className="w-6 h-6 md:w-8 md:h-8 cursor-pointer hover:opacity-80 hover:scale-110 transition" />
            <Youtube className="w-6 h-6 md:w-8 md:h-8 cursor-pointer hover:opacity-80 hover:scale-110 transition" />
          </div>
        </div>
      </footer>
    </div>
  );
};
