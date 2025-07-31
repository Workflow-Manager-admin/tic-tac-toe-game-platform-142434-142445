"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useGame, Game } from "../state";
import { gameApi } from "../api";
import { useRouter } from "next/navigation";
import { GameBoard } from "../components/GameBoard";
import { primaryButton, accentButton } from "../theme";

export default function PlayPage() {
  const { user, token } = useAuth();
  const { currentGame, setCurrentGame } = useGame();
  const [games, setGames] = useState<Game[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const router = useRouter();

  // List open games
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    const pollGames = async () => {
      try {
        const data = await gameApi.listGames(token);
        setGames(data.games ?? []);
      } catch (e) {
        setErr((e as Error).message || "Network error");
      }
    };
    pollGames();
    const interval = setInterval(pollGames, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [token]);

  // Poll current game (real-time updates)
  useEffect(() => {
    if (!currentGame?.id || !token) return;
    let stopped = false;
    const interval = setInterval(async () => {
      try {
        const g: Game = await gameApi.getGame(currentGame.id, token);
        if (!stopped) setCurrentGame(g);
      } catch {
        // ignore polling errors
      }
    }, 1800);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [currentGame?.id, token]);

  // Start a new game
  const createGame = async () => {
    setJoining(true); setErr(null);
    try {
      const game: Game = await gameApi.createGame(undefined, token!);
      setCurrentGame(game);
    } catch (e) {
      setErr((e as Error).message || "Failed to create game");
    } finally {
      setJoining(false);
    }
  };

  // Join a game
  const handleJoin = async (id: string) => {
    setJoining(true); setErr(null);
    try {
      const game: Game = await gameApi.getGame(id, token!);
      setCurrentGame(game);
    } catch {
      setErr("Failed to join");
    } finally {
      setJoining(false);
    }
  };

  // Play a move
  const handleMove = useCallback(async (pos: number) => {
    if (!currentGame) return;
    try {
      await gameApi.makeMove(currentGame.id, pos, token!);
      // Poll will update state
    } catch (e) {
      setErr((e as Error).message);
    }
  }, [currentGame, token]);

  // Calculate turn and winner
  let myTurn = false, winner: string | null = null, mark = "";
  if (currentGame) {
    winner = currentGame.winner || null;
    mark = currentGame.x_player === user?.username ? "X" : "O";
    myTurn = !winner && currentGame.turn === mark;
  }

  return (
    <div className="flex w-full flex-col md:flex-row gap-8">
      <div className="w-full md:w-[420px] flex flex-col gap-4 items-center">
        <h2 className="font-bold text-2xl mb-2">Find or Start a Game</h2>
        <button
          className={primaryButton + " w-full"}
          disabled={joining}
          onClick={createGame}
        >{joining ? "Creating..." : "Create New Game"}</button>
        <div className="w-full mt-2">
          <h3 className="text-lg font-semibold mb-1">Active Games</h3>
          <ul className="flex flex-col gap-2">
            {games.filter((g) => !g.winner).map(g => (
              <li key={g.id}>
                <button
                  className={accentButton + " w-full"}
                  onClick={() => handleJoin(g.id)}
                  disabled={joining}
                >
                  Game #{g.id} – {g.x_player} vs {g.o_player || "<Waiting>"}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {err && <div className="text-red-400 mt-4">{err}</div>}
      </div>
      <div className="flex-1 flex flex-col items-center gap-3">
        <h2 className="text-xl font-bold mb-2">Game Board</h2>
        {currentGame
          ? (
            <GameBoard
              board={currentGame.board}
              onMove={handleMove}
              myTurn={myTurn}
              winner={winner}
              statusMsg={winner
                ? `Winner: ${winner}`
                : (myTurn ? "Your turn" : "Waiting for opponent...")}
            />
          )
          : <div className="text-neutral-500 opacity-60 mt-10">Join or create a game to start playing!</div>
        }
      </div>
    </div>
  );
}
