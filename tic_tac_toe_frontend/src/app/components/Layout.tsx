"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "../state";
import { headerStyle, sidebarStyle } from "../theme";

// PUBLIC_INTERFACE
export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className={headerStyle + " flex justify-between items-center"}>
      <div className="font-bold text-xl text-[var(--color-foreground)]">
        <Link href="/" className="hover:underline">Tic Tac Toe</Link>
      </div>
      <nav className="flex gap-4">
        <Link href="/play" className="hover:underline">Play</Link>
        <Link href="/history" className="hover:underline">History</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
        {user
          ? <button
              className="ml-4 text-neutral-300 hover:text-red-400"
              onClick={logout}>Logout</button>
          : <Link href="/login" className="ml-4 text-neutral-300 hover:underline">Login</Link>}
      </nav>
    </header>
  );
}

// PUBLIC_INTERFACE
export function Sidebar({ children }: { children: ReactNode }) {
  return (
    <aside className={sidebarStyle + " hidden md:block"}>
      {children}
    </aside>
  );
}

// PUBLIC_INTERFACE
export function Footer() {
  return (
    <footer className="w-full text-center p-4 text-neutral-500 border-t border-neutral-900 bg-neutral-950 mt-10">
      &copy; {new Date().getFullYear()} Tic Tac Toe Game. Built with Next.js.
    </footer>
  );
}

// PUBLIC_INTERFACE
export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Header />
      <main className="flex flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
