import React from "react";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-2xl text-gray-700 mb-6">Access Denied</p>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
