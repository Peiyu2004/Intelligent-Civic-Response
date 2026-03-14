import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.tsx";
import { ReportList } from "./pages/ReportList.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import "./index.css";

function RedirectToHome() {
  useEffect(() => {
    window.location.href = "/zar/homePage.html";
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={<Navigate to="/zar/homePage.html" replace />}
        /> */}
        <Route path="/" element={<RedirectToHome />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-list" element={<ReportList />} />
      </Routes>
    </Router>
  );
}

export default App;
