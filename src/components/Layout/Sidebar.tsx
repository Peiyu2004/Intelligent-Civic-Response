import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed md:static top-16 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-80px)] flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <nav className="flex-1 pt-6 space-y-2">
          <NavLink
            to="/dashboard"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-6 py-3 font-medium text-lg transition-colors ${
                isActive
                  ? "bg-[#F8F8F8]/60 text-[#5932EA]"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#5932EA] rounded-r"></span>
                )}
                <LayoutDashboard className="w-6 h-6" />
                Dashboard
              </>
            )}
          </NavLink>

          <NavLink
            to="/report-list"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-6 py-3 font-medium text-lg transition-colors ${
                isActive
                  ? "bg-[#F8F8F8]/60 text-[#5932EA]"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#5932EA] rounded-r"></span>
                )}
                <FileText className="w-6 h-6" />
                Report List
              </>
            )}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};
