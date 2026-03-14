import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "user" | null;

interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Try API first, fallback to mock auth
      const response = await authenticateUser(username, password);

      if (response.success) {
        const userData: User = {
          id: response.userId,
          username: response.username,
          role: response.role as UserRole,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authToken", response.token);

        // Redirect based on role
        if (response.role === "user") {
          // Redirect to user HTML portal
          window.location.href = "/zar/index.html";
        }
        // Admin users stay in React app
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Authentication function
const authenticateUser = async (username: string, password: string) => {
  try {
    // Try to connect to backend API first
    const apiResponse = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      return {
        success: true,
        userId: data.userId || `user-${Date.now()}`,
        username: data.username,
        role: data.role,
        token: data.token || `mock-token-${Date.now()}`,
      };
    }
  } catch (error) {
    console.log("API not available, using mock authentication");
  }

  // Fallback to mock authentication
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users: Record<
    string,
    { password: string; role: string; userId: string }
  > = {
    admin123: { password: "admin123", role: "admin", userId: "admin-001" },
    user123: { password: "password123", role: "user", userId: "user-001" },
    demo: { password: "demo", role: "user", userId: "user-002" },
  };

  const user = users[username];

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Invalid username or password",
    };
  }

  return {
    success: true,
    userId: user.userId,
    username: username,
    role: user.role,
    token: `mock-token-${Date.now()}`,
  };
};
