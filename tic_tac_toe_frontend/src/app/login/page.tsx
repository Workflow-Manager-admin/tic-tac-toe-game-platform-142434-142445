"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../state";
import { primaryButton } from "../theme";

export default function LoginPage() {
  const { login, register, loading, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && password !== repeat) {
      alert("Passwords don't match");
      return;
    }
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      router.push("/play");
    } catch {
      // error is handled by context
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[70vh]">
      <form className="w-[340px] bg-neutral-900 rounded-xl shadow-xl p-8 flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="font-bold text-xl text-[var(--color-foreground)] mb-1">
          {isRegister ? "Register" : "Login"}
        </h2>
        <input
          type="text"
          className="rounded px-3 py-2 bg-neutral-800 text-white"
          placeholder="Username"
          autoFocus
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="rounded px-3 py-2 bg-neutral-800 text-white"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {isRegister &&
          <input
            type="password"
            className="rounded px-3 py-2 bg-neutral-800 text-white"
            placeholder="Repeat Password"
            required
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
          />}
        {error &&
          <div className="text-red-400 text-sm">{error}</div>
        }
        <button className={primaryButton + " mt-2"} type="submit" disabled={loading}>
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
        <div>
          <button
            type="button"
            className="text-sm text-[var(--color-foreground)] opacity-70 hover:underline mt-1"
            onClick={() => setIsRegister(v => !v)}
          >
            {isRegister ? "Have an account? Sign in" : "Need an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
