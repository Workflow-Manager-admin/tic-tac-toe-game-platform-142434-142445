"use client";

export const API_BASE_URL = "http://localhost:3001/api";

export async function apiRequest(path: string, opts: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: { ...headers, ...(opts.headers || {}) },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || res.statusText);
  return body;
}

/** Authentication APIs */
export const authApi = {
  // PUBLIC_INTERFACE
  async login(username: string, password: string) {
    return apiRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  // PUBLIC_INTERFACE
  async register(username: string, password: string) {
    return apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  // PUBLIC_INTERFACE
  async logout(token: string) {
    return apiRequest("/auth/logout/", {
      method: "POST",
    }, token);
  },
  // PUBLIC_INTERFACE
  async getProfile(token: string) {
    return apiRequest("/user/profile/", {}, token);
  }
};

/** Game APIs */
export const gameApi = {
  // PUBLIC_INTERFACE
  async listGames(token: string) {
    return apiRequest("/games/", {}, token);
  },
  // PUBLIC_INTERFACE
  async getGame(gameId: string, token: string) {
    return apiRequest(`/games/${gameId}/`, {}, token);
  },
  // PUBLIC_INTERFACE
  async makeMove(gameId: string, position: number, token: string) {
    return apiRequest(`/games/${gameId}/move/`, {
      method: "POST",
      body: JSON.stringify({ position }),
    }, token);
  },
  // PUBLIC_INTERFACE
  async createGame(opponent?: string, token?: string) {
    return apiRequest("/games/", {
      method: "POST",
      body: JSON.stringify({ opponent }),
    }, token);
  },
  // PUBLIC_INTERFACE
  async getHistory(token: string) {
    return apiRequest("/games/history/", {}, token);
  }
};

