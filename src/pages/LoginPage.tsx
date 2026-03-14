import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Facebook, Instagram, MessagesSquare, Twitter, Youtube } from "lucide-react";
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

  // const handleForgotPassword = () => {
  //   alert("Password reset functionality coming soon!");
  // };

  // const handleRegister = () => {
  //   alert("Registration functionality coming soon!");
  // };

  const handleForgotPassword = () => {
    window.location.href = "/zar/forgetPassword.html";
  };

  const handleRegister = () => {
    window.location.href = "/zar/register.html";
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
      <div className="fixed inset-0 bg-black/40 z-0"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-center pt-6">
        <div className="w-[90%] md:w-[85%] bg-white/70 backdrop-blur-md rounded-full px-6 py-5 flex justify-between items-center shadow-lg">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={handleHome}
          >
            <MessagesSquare className="w-8 h-8 md:w-10 md:h-10 text-white-600" />
            <span className="text-gray-800 font-bold text-xl md:text-3xl">CiviScan</span>
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
      <div className="relative z-10g flex-1 flex items-center justify-center px-4 py-12">
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

      {/* Divider */}
      <div className="relative border-t border-white/50 mx-4 md:mx-10"></div>

      {/* FOOTER */}
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
