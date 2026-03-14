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
      // Mock authentication - replace with actual API call
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

// Mock authentication function - replace with your API call
const authenticateUser = async (username: string, password: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock users database
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
