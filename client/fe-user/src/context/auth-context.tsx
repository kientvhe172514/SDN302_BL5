"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Constants } from "../lib/constants";
import { jwtDecode } from "jwt-decode";
import { isTokenValid } from "@/helpers/auth/checktoken";
import { TokenPayload } from "@/models/token/TokenPayload.model";

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: TokenPayload | null;
  loginSuccess: (token: string) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<TokenPayload | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<TokenPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(Constants.API_TOKEN_KEY);
    const currentPath = window.location.pathname;

    if (currentPath.startsWith("/")) {
      if (token && isTokenValid(token)) {
        setIsLoggedIn(true);
        const decoded = jwtDecode<TokenPayload>(token);
        setUserInfo(decoded);
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
      return;
    }

    if (!token || !isTokenValid(token)) {
      setIsLoggedIn(false);
      localStorage.removeItem(Constants.API_TOKEN_KEY);
      localStorage.removeItem(Constants.API_REFRESH_TOKEN_KEY);
      router.replace("/authentication/login");
      return;
    }

    setIsLoggedIn(true);
    const decoded = jwtDecode<TokenPayload>(token);
    setUserInfo(decoded);
    if (decoded.role === "admin" && !currentPath.startsWith("/")) {
      router.replace("/");
    }
  }, []);

  const loginSuccess = (token: string) => {
    localStorage.setItem(Constants.API_TOKEN_KEY, token);
    const decoded = jwtDecode<TokenPayload>(token);
    setUserInfo(decoded);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userInfo, loginSuccess, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
