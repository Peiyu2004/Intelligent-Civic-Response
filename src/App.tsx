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
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { UnauthorizedPage } from "./pages/UnauthorizedPage.tsx";
import "./index.css";

// function RedirectToHome() {
//   useEffect(() => {
//     window.location.href = "/zar/homePage.html";
//   }, []);

//   return null;
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* <Route
//           path="/"
//           element={<Navigate to="/zar/homePage.html" replace />}
//         /> */}
//         <Route path="/" element={<RedirectToHome />} />
//         <Route path="/admin" element={<AdminPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/report-list" element={<ReportList />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-list"
        element={
          <ProtectedRoute requiredRole="admin">
            <ReportList />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
