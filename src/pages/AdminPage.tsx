import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MessagesSquare,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.tsx";

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showCard, setShowCard] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    navigate("/dashboard");
  };

  // const handleLogout = () => {
  //   window.location.href = "/zar/homePage.html";
  // };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="w-full bg-cover bg-center relative flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/assets/kl-city.png')",
        // minHeight: "1200px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Navbar */}
      <div className="relative flex justify-center pt-6 mt-10 ">
        <div className="w-[85%] bg-white/70 backdrop-blur-md rounded-full px-6 py-5 flex justify-between items-center">
          {/* Logo */}
          <div className=" flex items-center gap-2">
            <MessagesSquare className="w-10 h-10 ml-2" />
            <span className="text-gray-800 font-medium text-3xl">CiviScan</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Admin Profile */}
            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setShowCard(!showCard)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-4 rounded-full cursor-pointer hover:bg-gray-200 transition"
              >
                <CircleUserRound className="w-7 h-7 text-gray-700" />
                <span className="text-gray-700 font-medium">ADMIN</span>
              </div>
              {/* Dropdown */}
              {showCard && (
                <div className="absolute top-14 right-0 bg-white rounded-xl shadow-lg w-60 p-6 text-center">
                  <CircleUserRound className="w-20 h-20 mx-auto text-gray-600 mb-2" />
                  <p className="font-semibold mb-3">ADMIN</p>
                  <div className="flex flex-row">
                    <button className="border-2 rounded-full px-3 py-1 text-sm mr-2">
                      View Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="border-2 rounded-full px-3 py-1 text-sm"
                    >
                      Log out
                    </button>

                    {/* <button
                      onClick={(e) => {
                        e.preventDefault(); // prevents any default behavior
                        window.location.href = "/public/zar/homePage.html"; // or use replace()
                      }}
                      className="border-2 rounded-full px-3 py-1 text-sm"
                    >
                      Log out
                    </button> */}
                  </div>
                </div>
              )}
            </div>

            {/* Get Started */}
            <button
              onClick={handleStart}
              className="bg-white px-4 py-4 rounded-full shadow font-medium hover:bg-gray-100 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center text-white flex-1">
        <h1 className="text-9xl font-bold mb-4">
          INTELLIGENT <br /> CIVIC RESPONSE
        </h1>

        <p className="text-2xl mb-8">
          Report infrastructure issues to help improve the city
        </p>

        <button
          onClick={handleStart}
          className="bg-purple-600 hover:bg-purple-700 px-14 py-7 rounded-full text-4xl font-bold shadow-xl hover:shadow-purple-500/40 transition"
        >
          Get Started
        </button>
      </div>

      {/* Divider */}
      <div className="relative border-t border-white/50 mx-10"></div>

      {/* Footer */}
      <div className="relative flex justify-between text-white text-lg px-10 py-6">
        <div className=" flex items-center gap-2">
          <MessagesSquare className="w-10 h-10 ml-2" />
          <span className="text-white-800 font-medium text-3xl">CiviScan</span>
        </div>

        <div className="text-center text-3xl">
          <p>About Us</p>
          <p>Home | Terms | Privacy | Contact</p>
        </div>

        <div className=" flex items-center gap-2">
          <Instagram className="w-10 h-10 ml-2" />
          <Facebook className="w-10 h-10 ml-2" />
          <Twitter className="w-10 h-10 ml-2" />
          <Youtube className="w-10 h-10 ml-2" />
        </div>
      </div>
    </div>
  );
};
