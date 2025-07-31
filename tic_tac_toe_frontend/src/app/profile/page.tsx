"use client";
import React, { useEffect } from "react";
import { useAuth } from "../state";
import { primaryButton } from "../theme";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, fetchProfile, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
    else fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  if (!user) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full">
      <h2 className="text-2xl font-bold mb-2">Profile</h2>
      <div className="bg-neutral-900 rounded-xl px-8 py-6 shadow">
        <div className="mb-3 text-lg">
          <span className="opacity-50">Username:</span> <span className="font-bold">{user.username}</span>
        </div>
        <button className={primaryButton} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
