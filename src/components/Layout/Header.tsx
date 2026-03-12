import { Bell, Settings, User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    navigate("/home");
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
    <header className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 p-3 ">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
          CiviScan
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Admin Profile */}
          {/* Admin Profile */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setShowCard(!showCard)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-4 rounded-full cursor-pointer hover:bg-gray-200 transition"
            >
              <User className="w-7 h-7 text-gray-700" />
              <span className="text-gray-700 font-medium">ADMIN</span>
            </div>
            {/* Dropdown */}
            {showCard && (
              <div className="absolute top-14 right-0 bg-white rounded-xl shadow-lg w-60 p-6 text-center">
                <User className="w-10 h-10 mx-auto text-gray-600 mb-2" />
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
                </div>
              </div>
            )}
          </div>

          {/* Notification */}
          <Bell className="w-7 h-7 text-gray-600 cursor-pointer hover:text-gray-800 transition" />

          {/* Settings */}
          <Settings className="w-7 h-7 text-gray-600 cursor-pointer hover:text-gray-800 transition" />
        </div>
      </div>
    </header>
  );
};
