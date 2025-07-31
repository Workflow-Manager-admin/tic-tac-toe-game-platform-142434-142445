"use client";
import React from "react";
import { colors } from "../theme";

// PUBLIC_INTERFACE
export function GameBoard({
  board,
  onMove,
  myTurn,
  winner,
  statusMsg,
}: {
  board: string[];
  onMove: (idx: number) => void;
  myTurn: boolean;
  winner: string | null;
  statusMsg?: string;
}) {
  function handleClick(idx: number) {
    if (board[idx] || winner || !myTurn) return;
    onMove(idx);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-3 gap-1 w-64">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            style={{
              color: cell === "X" ? colors.primary : (cell === "O" ? colors.accent : ""),
              fontWeight: "bolder",
              fontSize: "2rem",
            }}
            className={
              "w-20 h-20 flex items-center justify-center border border-neutral-800 rounded bg-neutral-800 hover:bg-neutral-700 select-none transition"
              + (cell ? " cursor-default" : "")
            }
            aria-label={`Cell ${idx+1}`}
          >
            {cell || ""}
          </button>
        ))}
      </div>
      {winner &&
        <div className="mt-4 text-lg font-bold text-[var(--color-foreground)]">
          Winner: {winner}
        </div>}
      {statusMsg &&
        <div className="mt-1 text-sm text-neutral-400">{statusMsg}</div>}
    </div>
  );
}
