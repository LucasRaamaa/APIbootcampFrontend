import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { IUser } from "../types";
import { authService } from "../modules/auth/authService";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, payloadUser?: Partial<IUser>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      console.warn("Token expired or invalid", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoading(true);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
