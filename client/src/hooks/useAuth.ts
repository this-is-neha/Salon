import { useState, useEffect } from "react";
import type { DecodedToken } from "../types";

function decodeToken(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token.split(".")[1])) as DecodedToken;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  const evaluate = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserId("");
      setRole("");
      return;
    }

    const payload = decodeToken(token);
    if (!payload) return;

    const userRole = payload.role?.toLowerCase() ?? "";
    setUserId(payload.sub ?? payload.id ?? "");
    setRole(userRole);
    setIsAdmin(userRole === "admin");
    setIsLoggedIn(true);
  };

  useEffect(() => {
    evaluate();
    window.addEventListener("storage", evaluate);
    return () => window.removeEventListener("storage", evaluate);
  }, []);

  const logout = () => {
    localStorage.setItem("token", "");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserId("");
    setRole("");
    window.dispatchEvent(new Event("storage"));
  };

  return { isAdmin, userId, isLoggedIn, role, logout };
}