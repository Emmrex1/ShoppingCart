"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUser, isAuthenticated } from "@/service/authService";

interface AuthContextType {
  user: { userId: string; name: string; email: string; avatar?: string | null } | null;
  isAuth: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    isAuth: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser();
      setAuthState({
        user,
        isAuth: isAuthenticated(),
        loading: false,
      });
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);