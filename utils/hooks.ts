import { useEffect, useState } from "react";
import { fetchTeams, fetchGameState, updateGameState } from "./api";
import type { GameState, Team, UpdateGameStatePayload } from "@/types";

// Hook to fetch and manage teams
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = () => {
      fetchTeams()
        .then((data) => {
          if (isMounted) setTeams(data);
        })
        .catch((err: unknown) => {
          if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    fetch();
    const intervalId = setInterval(fetch, 1000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { teams, loading, error };
}

// Hook to fetch and manage game state
export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = () => {
      fetchGameState()
        .then((data) => {
          if (isMounted) setGameState(data);
        })
        .catch((err: unknown) => {
          if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    fetch();
    const intervalId = setInterval(fetch, 1000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Optionally expose updateGameState
  const update = async (payload: UpdateGameStatePayload): Promise<GameState> => {
    try {
      setLoading(true);
      await updateGameState(payload);
      const fresh = await fetchGameState();
      setGameState(fresh);
      return fresh;
    } catch (err: unknown) {
      const asError = err instanceof Error ? err : new Error(String(err));
      setError(asError);
      throw asError;
    } finally {
      setLoading(false);
    }
  };

  return { gameState, loading, error, update };
}
