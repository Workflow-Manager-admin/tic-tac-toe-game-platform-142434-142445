import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
      <main className="flex flex-col gap-10 items-center p-14">
        <h1 className="font-bold text-4xl md:text-5xl tracking-tight text-center mb-2">
          Welcome to Tic Tac Toe Online!
        </h1>
        <p className="text-xl opacity-80 text-center max-w-2xl mb-2">
          Play a modern, real-time game of Tic Tac Toe against your friends and view your match history. Fast, responsive, and secure.
        </p>
        <Link
          href="/play"
          className="bg-[#34A853] text-white rounded-xl px-10 py-3 text-lg font-semibold hover:brightness-110 transition shadow mt-2"
        >
          Play Now
        </Link>
      </main>
      <footer className="text-center py-8 text-neutral-500 w-full border-t border-neutral-900">
        &copy; {new Date().getFullYear()} Tic Tac Toe Game. Built with Next.js.
      </footer>
    </div>
  );
}
