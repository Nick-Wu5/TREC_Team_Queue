import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase-js";

/**
 * API Endpoint: Game State Management
 *
 * This API endpoint manages the game state for a real-time application.
 * It integrates with the Supabase database to handle operations such as
 * fetching the current game state, starting a game, ending a game, and
 * updating the game timer.
 *
 * Supported HTTP Methods:
 * - `GET`: Fetch the current game state.
 * - `PUT`: Update the game state, start a game, end a game, or modify the timer.
 *
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 *
 * @returns {void} Sends a JSON response or an appropriate HTTP status code.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("game_state")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching game state:", error);
        return res.status(500).json({ error: "Failed to fetch game state" });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Unexpected error during GET:", err);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  }

  if (req.method === "PUT") {
    const { action } = req.query;
    const { timer } = req.body;

    // Handle "start" and "end" actions
    if (action === "start") {
      const { error } = await supabase
        .from("game_state")
        .update({ timer: 420, game_active: true, game_ended: false })
        .eq("id", 1);

      if (error) {
        console.error("Error starting game:", error);
        return res.status(500).json({ error: "Failed to start game" });
      }

      return res.status(200).json({ message: "Game started successfully" });
    }

    if (action === "end") {
      const { error } = await supabase
        .from("game_state")
        .update({ timer: 420, game_active: false, game_ended: true })
        .eq("id", 1);

      if (error) {
        console.error("Error ending game:", error);
        return res.status(500).json({ error: "Failed to end game" });
      }

      return res.status(200).json({ message: "Game ended successfully" });
    }

    // Allow updates to the timer without requiring an action
    if (!action && timer !== undefined) {
      const { error } = await supabase
        .from("game_state")
        .update({ timer })
        .eq("id", 1);

      if (error) {
        console.error("Error updating timer:", error);
        return res.status(500).json({ error: "Failed to update timer" });
      }

      return res.status(200).json({ message: "Timer updated successfully" });
    }

    return res
      .status(400)
      .json({ error: "Invalid action parameter or missing timer" });
  }

  // Handle unsupported methods
  return res.status(405).json({ error: "Method not allowed" });
}
