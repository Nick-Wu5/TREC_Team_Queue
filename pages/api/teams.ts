import { NextApiRequest, NextApiResponse } from "next";
import { supabase, initializeSupabaseClient } from "../../utils/supabase-js";

/**
 * API Endpoint: Team Management
 *
 * This API endpoint handles CRUD (Create, Read, Update, Delete) operations for managing teams
 * in the application. It integrates with the Supabase database to perform actions such as
 * fetching the team list, adding new teams, updating team streaks and positions, and
 * removing teams securely using passwords or a master key.
 *
 * Request Body (for POST/DELETE/PUT):
 * - `teamName` (string): Name of the team.
 * - `password` (string): Password for authentication.
 * - `masterKey` (string, optional): Master key for admin-level deletion.
 * - `orderedTeams` (array, optional): Array of team IDs and their updated positions.
 * - `streak` (number, optional): Updated streak value for a specific team.
 * - `resetAll` (boolean, optional): Flag to reset streaks for all teams.
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
  console.log("Request received:", req.method);
  console.log("Authorization Header:", req.headers.authorization);

  try {
    if (req.method === "GET") {
      // Retrieves the list of teams, ordered by their `position`.
      const teams = await readTeams();
      return res.status(200).json(teams);
    } else if (req.method === "POST") {
      // Adds a new team to the database.
      // Add a new team
      console.log("Handling POST request");

      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "Authorization token missing" });
      }

      const supabaseServer = initializeSupabaseClient(token);

      const { teamName, password } = req.body;

      if (!teamName || !password) {
        return res
          .status(200)
          .json({ error: "Team name and password are required" });
      }

      try {
        const { data, error } = await supabaseServer.from("teams").insert([
          {
            teamName,
            password,
          },
        ]);

        if (error) {
          return res.status(403).json({
            error: error.message || "Row-Level Security policy violation",
          });
        }

        return res
          .status(201)
          .json({ message: "Team added successfully", team: data });
      } catch (error) {
        console.error("Unexpected Error:", error);
        return res.status(500).json({ error: "Unexpected server error" });
      }
    } else if (req.method === "DELETE") {
      // Removes a team using the team's name, password, or a master key for override.
      try {
        const { teamName, password, masterKey } = req.body;

        if (!teamName || (!password && !masterKey)) {
          return res
            .status(400)
            .json({ message: "Team name and password are required" });
        }

        // Define the master key securely (use an environment variable)
        const MASTER_KEY = process.env.MASTER_KEY;
        console.log("Master Key:", process.env.MASTER_KEY);
        console.log("Inputted Master Key:", masterKey);

        if (masterKey === MASTER_KEY) {
          // Master key is valid, skip password check
          const { data: team, error: fetchError } = await supabase
            .from("teams")
            .select("id")
            .ilike("teamName", teamName)
            .single();

          if (fetchError || !team) {
            return res.status(404).json({ message: "Team not found" });
          }

          // Delete the team
          const { error: deleteError } = await supabase
            .from("teams")
            .delete()
            .eq("id", team.id);

          if (deleteError) {
            throw deleteError;
          }

          return res
            .status(200)
            .json({ message: "Team deleted successfully using master key" });
        } else {
          // Validate password if master key is not provided
          const { data: team, error: fetchError } = await supabase
            .from("teams")
            .select("id, password")
            .ilike("teamName", teamName)
            .single();

          if (fetchError || !team) {
            return res.status(404).json({ message: "Team not found" });
          }

          if (team.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
          }

          // Delete the team
          const { error: deleteError } = await supabase
            .from("teams")
            .delete()
            .eq("id", team.id);

          if (deleteError) {
            throw deleteError;
          }

          return res.status(200).json({ message: "Team deleted successfully" });
        }
      } catch (error) {
        console.error("Error deleting team:", error);
        return res.status(500).json({ message: "Failed to delete team" });
      }
    } else if (req.method === "PUT") {
      // Updates team positions and streaks based on the game outcome.
      try {
        const { orderedTeams, teamName, streak, resetAll } = req.body; // Get orderedTeams, teamName, and streak from request body

        if (resetAll) {
          // Reset streaks for all teams
          const { error } = await supabase
            .from("teams")
            .update({ streak: 0 })
            .neq("id", 0);

          if (error) {
            console.error("Error resetting streaks:", error.message);
            return res
              .status(500)
              .json({ error: "Failed to reset streaks for all teams" });
          }
        }

        // Update team positions
        if (orderedTeams) {
          if (!Array.isArray(orderedTeams)) {
            return res
              .status(200)
              .json({ error: "Invalid team order provided" });
          }

          const updates = orderedTeams.map(({ id, position }) =>
            supabase.from("teams").update({ position }).eq("id", id)
          );
          await Promise.all(updates);
          console.log("Team positions updated in the database");
        }

        // Update streak
        if (teamName && typeof streak === "number") {
          const { data, error } = await supabase
            .from("teams")
            .update({ streak })
            .eq("teamName", teamName);

          console.log("increased streaks");

          if (error) {
            console.error("Error updating team streak:", error.message);
            return res
              .status(500)
              .json({ error: "Failed to update team streak" });
          }

          return res
            .status(200)
            .json({ message: "Team streak updated successfully", data });
        }

        // Handle invalid request data
        return res.status(200).json({
          error: "Invalid request data for updating streak or positions",
        });
      } catch (error) {
        console.error("Error updating team positions or streak:", error);
        return res
          .status(200)
          .json({ error: "Failed to update team positions or streak" });
      }
    } else {
      // Unsupported methods return a `405 Method Not Allowed` status.
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(200).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}

// Fetches all tams from the teams table in Supabase, ordered by the position column
const readTeams = async () => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("position", { ascending: true }); // Order by 'position' in ascending order
  if (error) throw error;
  return data;
};
