import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./AuthContext";
import axios from "./axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem("refreshToken"));
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await axios.get("/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post("/token/", { username, password });
      const token = res.data.access;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", res.data.refresh);
      setAccessToken(token);
      setRefreshToken(res.data.refresh);
      await fetchUser(token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const refresh = useCallback(async () => {
    try {
      const res = await axios.post("/token/refresh/", {
        refresh: refreshToken,
      });
      const token = res.data.access;
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      await fetchUser(token);
    } catch {
      logout(); // Refresh failed
    }
  }, [fetchUser, refreshToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ⏱️ Auto-refresh logic
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;

    const scheduleRefresh = () => {
      if (!accessToken) return;

      const decoded = jwtDecode(accessToken);
      if (!decoded || !decoded.exp) return;
      const exp = decoded.exp * 1000;
      const timeout = exp - Date.now() - 5000; // 5s before expiry

      if (timeout > 0) {
        interval = setTimeout(refresh, timeout);
      } else {
        refresh(); // expired
      }
    };

    scheduleRefresh();
    return () => clearTimeout(interval);
  }, [accessToken, fetchUser, refresh, refreshToken]);

  return <AuthContext.Provider value={{ accessToken, user, login, logout }}>{children}</AuthContext.Provider>;
};
