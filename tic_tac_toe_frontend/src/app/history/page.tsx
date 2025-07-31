"use client";
import React, { useEffect, useState } from "react";
import { useAuth, useGame, Game } from "../state";
import { gameApi } from "../api";
import { useRouter } from "next/navigation";
import { sidebarStyle } from "../theme";
import { GameBoard } from "../components/GameBoard";

export default function HistoryPage() {
  const { token } = useAuth();
  const { history, setHistory } = useGame();
  const [selected, setSelected] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    gameApi.getHistory(token)
      .then(data => setHistory(data.games ?? []))
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="flex flex-1">
      <aside className={sidebarStyle + " w-[260px]"}>
        <h2 className="font-bold text-lg mb-3">Game History</h2>
        {loading && <div>Loading...</div>}
        {err && <div className="text-red-500">{err}</div>}
        <ul className="flex flex-col gap-2">
          {history.map((g: Game) => (
            <li key={g.id}>
              <button
                className={"w-full text-left p-2 rounded hover:bg-neutral-800 transition " + (selected?.id === g.id ? "bg-neutral-800" : "")}
                onClick={() => setSelected(g)}
              >
                Game #{g.id} <br />
                {g.opponent} | {g.winner ? `Winner: ${g.winner}` : "In progress"}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col items-center justify-start p-8">
        <h2 className="font-bold text-2xl mb-4">Game Details</h2>
        {selected
          ? <GameBoard board={selected.board} onMove={() => {}} myTurn={false} winner={selected.winner || null} statusMsg={`Opponent: ${selected.opponent}`} />
          : <div className="p-4 text-neutral-400">Select a match to view details.</div>}
      </main>
    </div>
  );
}
