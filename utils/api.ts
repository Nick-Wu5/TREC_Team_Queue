import type { GameState, Team, UpdateGameStatePayload } from "@/types";

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch("/api/teams");
  if (!response.ok) throw new Error("Failed to fetch teams");
  return (await response.json()) as Team[];
}

export async function fetchGameState(): Promise<GameState> {
  const response = await fetch("/api/gameState");
  if (!response.ok) throw new Error("Failed to fetch game state");
  return (await response.json()) as GameState;
}

export async function updateGameState(
  payload: UpdateGameStatePayload
): Promise<{ message: string }> {
  const response = await fetch("/api/gameState", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update game state");
  return (await response.json()) as { message: string };
}
