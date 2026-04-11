import { useState } from "react";
import { fetchTeams } from "./api";

export function useTeamActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const createTeam = async (teamName: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamname: teamName, password }),
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) throw new Error(result.error || "Unknown error");
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  const removeTeam = async (
    teamName: string,
    teamPassword: string,
    masterKey: string,
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamname: teamName,
          password: teamPassword,
          masterKey,
        }),
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) throw new Error(result.error || "Unknown error");
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { createTeam, removeTeam, loading, error };
}
