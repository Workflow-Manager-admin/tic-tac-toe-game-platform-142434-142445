"use client";

import React, { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "./api";

interface UserProfile {
  username: string;
  id: number;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore from localStorage if available
    const t = localStorage.getItem("auth_token");
    if (t) {
      setToken(t);
      authApi.getProfile(t)
        .then(profile => setUser(profile))
        .catch(() => {
          setToken(null);
          localStorage.removeItem("auth_token");
        });
    }
  }, []);

  async function login(username: string, password: string) {
    setLoading(true); setError(null);
    try {
      const data = await authApi.login(username, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.token);
    } catch (e) {
      setError((e as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, password: string) {
    setLoading(true); setError(null);
    try {
      const data = await authApi.register(username, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.token);
    } catch (e) {
      setError((e as Error).message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      if (token) await authApi.logout(token);
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    setLoading(false);
  }

  async function fetchProfile() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await authApi.getProfile(token);
      setUser(data);
    } catch {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, register, logout, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Game state types */
export interface Game {
  id: string;
  x_player: string;
  o_player: string;
  turn: "X" | "O";
  board: string[];
  winner?: string | null;
  opponent?: string;
}

/** Game state context */
interface GameStateType {
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;
  history: Game[];
  setHistory: (h: Game[]) => void;
}

const GameContext = createContext<GameStateType | undefined>(undefined);

// PUBLIC_INTERFACE
export function GameProvider({ children }: { children: ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [history, setHistory] = useState<Game[]>([]);

  return (
    <GameContext.Provider value={{
      currentGame, setCurrentGame,
      history, setHistory,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
