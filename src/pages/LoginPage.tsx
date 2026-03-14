import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username || !password) {
        setError("Please enter both username and password");
        setLoading(false);
        return;
      }

      await login(username, password);

      // Redirect based on role - handled in AuthContext
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset functionality coming soon!");
  };

  const handleRegister = () => {
    alert("Registration functionality coming soon!");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/kl-city.png')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Navbar */}
      <nav className="relative flex justify-center pt-6">
        <div className="w-[90%] md:w-[85%] bg-white/70 backdrop-blur-md rounded-full px-6 py-5 flex justify-between items-center shadow-lg">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={handleHome}
          >
            <MessageSquare className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-2xl">CiviScan</span>
          </div>

          {/* Home Button */}
          <button
            onClick={handleHome}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-2 rounded-full transition"
          >
            Home
          </button>
        </div>
      </nav>

      {/* LOGIN CONTAINER */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md">
          {/* Form */}
          <form id="loginForm" onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="form-row">
              <label className="block text-gray-700 font-semibold text-lg mb-2">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="User123"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-white/90"
                disabled={loading}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-row">
              <label className="block text-gray-700 font-semibold text-lg mb-2">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password123"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-white/90 pr-12"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button Row */}
            <div className="button-row flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Forget Password
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-full transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            {/* Register Row */}
            <div className="register-row pt-4">
              <button
                type="button"
                onClick={handleRegister}
                className="w-full bg-white hover:bg-gray-50 border-2 border-purple-600 text-purple-600 font-semibold py-3 px-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/20">
        <div className="px-6 py-8 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Footer Left */}
            <div className="footer-left flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-2xl">CiviScan</span>
            </div>

            {/* Footer Center */}
            <div className="footer-center text-center">
              <p className="text-white font-bold text-lg mb-3">About Us</p>
              <p className="text-white/80 text-sm space-x-2">
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
                <span>|</span>
                <a href="#" className="hover:text-white transition">
                  Term & Condition
                </a>
                <span>|</span>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
                <span>|</span>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </p>
            </div>

            {/* Footer Right */}
            <div className="footer-right flex flex-col items-center md:items-end gap-3">
              <p className="text-white font-bold text-lg">Social Media</p>
              <div className="flex gap-4">
                {/* Instagram */}
                <a href="#" className="hover:opacity-80 transition">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" className="hover:opacity-80 transition">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="#" className="hover:opacity-80 transition">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.75 5.413 2.174 7.684L2.965 21.98l2.922-.968c2.216 1.203 4.718 1.838 7.273 1.838 5.368 0 9.927-4.059 10.33-9.35.02-.247.031-.494.031-.743a9.861 9.861 0 00-9.746-9.778" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" className="hover:opacity-80 transition">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
