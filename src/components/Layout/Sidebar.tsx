import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, FileText } from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-80px)] mt-[80px] flex flex-col">
      <nav className="flex-1 pt-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-6 py-3 font-medium text-xl transition-colors ${
              isActive
                ? "bg-[#F8F8F8]/60 text-[#5932EA] p-3"
                : "text-gray-700 hover:bg-gray-100 p-3"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-[#5932EA] rounded-r"></span>
              )}
              <BarChart3 className="w-7 h-7" />
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink
          to="/report-list"
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-6 py-3 font-medium text-xl transition-colors ${
              isActive
                ? "bg-[#F8F8F8]/60 text-[#5932EA] p-3"
                : "text-gray-700 hover:bg-gray-100 p-3"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-[#5932EA] rounded-r"></span>
              )}
              <FileText className="w-7 h-7" />
              Report List
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};
