"use client";

import React, { useEffect, useState } from "react";

/**
 * Control Page
 *
 * This component provides an interface for managing the teams within the queue.
 * It allows users to start/stop games, manage team actions (win/draw), and add/remove teams.
 * This component also synchronizes state across multiple views using the BroadcastChannel API.
 *
 * @returns {JSX.Element} The rendered control page UI.
 */

const ControlPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<"add" | "remove" | null>(null); // Controls which action panel (add/remove) is active.
  const [timer, setTimer] = useState<number>(420); // Default 7:00
  const [gameActive, setGameActive] = useState(false); // Flags for the game's active and end states.
  const [gameEnded, setGameEnded] = useState(false);
  const [teamName, setTeamName] = useState(""); // Form inputs for team actions.
  const [password, setPassword] = useState(""); // Password var when creating a team
  const [masterKey, setMasterKey] = useState(""); // Password var when removing a team
  const [teamPassword, setTeamPassword] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false); // Whether the confirmation panel is displayed.
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null); // Tracks the selected team and action for updates.
  const [selectedAction, setSelectedAction] = useState<"win" | "draw" | null>(
    null
  );
  const [teamAStreak, setTeamAStreak] = useState(0); // Tracks the win streak of the first team in the list.

  const broadcastChannel = new BroadcastChannel("game_state_channel");

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchGameState();
    fetchTeams();
    const intervalId = setInterval(fetchTeams, 1000); // Refresh teams every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Start/Stop Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateGameState = async (newTime: number) => {
      await fetch("/api/gameState", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timer: newTime,
          game_active: gameActive,
          game_ended: gameEnded,
        }),
      });

      // Broadcast the updated state to other pages
      broadcastChannel.postMessage({
        timer: newTime,
        gameEnded: gameEnded,
      });
    };

    const stopGame = async () => {
      clearInterval(interval);
      setGameEnded(true);
      setGameActive(false);
      await updateGameState(0); // Sync final state
      broadcastChannel.postMessage({
        timer: 0,
        gameEnded: true,
      });
    };

    if (gameActive && !gameEnded) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;

          // Sync the timer with the database
          updateGameState(newTime);

          if (newTime <= 0) {
            stopGame();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameActive, gameEnded]);

  // Close the BroadcastChannel only when the component unmounts
  useEffect(() => {
    return () => {
      broadcastChannel.close();
    };
  }, []);

  // Fetches the team list from the backend periodically.
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        console.error("Error fetching teams:", response.statusText);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTeams(data);
        console.log("Fetched teams:", data);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  // Fetches the game state from the backend.
  const fetchGameState = async () => {
    try {
      const response = await fetch("/api/gameState", {
        method: "GET", // Ensure this matches the handler
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        console.error(
          "Error fetching game state:",
          response.statusText,
          response.status
        );
        return;
      }

      const data = await response.json();
      console.log("Fetched game state:", data);
      setTimer(data.timer);
      setGameActive(data.game_active);
      setGameEnded(data.game_ended);
    } catch (error) {
      console.error("Failed to fetch game state (network issue):", error);
    }
  };

  // Starts the game by updating the game state in the backend.
  const handleStartGame = async () => {
    try {
      const response = await fetch("/api/gameState?action=start", {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to start the game");
      }

      // Fetch the updated game state after starting
      const gameStateResponse = await fetch("/api/gameState");
      if (!gameStateResponse.ok) {
        throw new Error("Failed to fetch updated game state");
      }
      const updatedGameState = await gameStateResponse.json();

      // Update local state with the new values
      setTimer(updatedGameState.timer);
      setGameActive(updatedGameState.game_active);
      setGameEnded(updatedGameState.game_ended);

      // Broadcast the updated state
      broadcastChannel.postMessage({
        timer: updatedGameState.timer,
        gameActive: updatedGameState.game_active,
        gameEnded: updatedGameState.game_ended,
      });

      console.log("Game started successfully:", updatedGameState);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  // Ends the game by updating the game state in the backend.
  const handleManualEnd = async () => {
    try {
      const response = await fetch("/api/gameState?action=end", {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to end the game");
      }

      // Fetch the updated game state after ending
      const gameStateResponse = await fetch("/api/gameState");
      if (!gameStateResponse.ok) {
        throw new Error("Failed to fetch updated game state");
      }
      const updatedGameState = await gameStateResponse.json();

      // Update local state with the new values
      setTimer(updatedGameState.timer);
      setGameActive(updatedGameState.game_active);
      setGameEnded(updatedGameState.game_ended);

      // Broadcast the updated state
      broadcastChannel.postMessage({
        timer: updatedGameState.timer,
        gameActive: updatedGameState.game_active,
        gameEnded: updatedGameState.game_ended,
      });

      console.log("Game ended successfully:", updatedGameState);
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  // Sends a request to add a new team.
  const createTeam = async () => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, password }),
      });

      const result = await response.json(); // Parse JSON response

      if (response.ok) {
        fetchTeams(); // Refresh teams after creation
        setTeamName(""); // Clear the team name input
        setPassword(""); // Clear the team password input
        setActivePanel(null); // Close panel
        console.log("Success:", result.message); // Log success message
      } else {
        console.error("Error:", result.error || "Unknown error occurred");
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to create team:", error);
      alert("An error occurred while creating the team.");
    }
  };

  // Sends a request to remove a team.
  const removeTeam = async () => {
    if (!teamName || (!teamPassword && !masterKey)) {
      alert("Please enter the team name and either a password or master key.");
      return;
    }

    try {
      const response = await fetch("/api/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          password: teamPassword,
          masterKey, // Include the master key in the request body
        }),
      });

      if (response.ok) {
        fetchTeams(); // Refresh teams after deletion
        setTeamName(""); // Clear the team name input
        setTeamPassword(""); // Clear the team password input
        setMasterKey(""); // Clear the master key input (if applicable)
        setActivePanel(null); // Close panel
        alert("Team removed successfully.");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to remove team:", error);
      alert("An error occurred while removing the team.");
    }
  };

  // Manges the create/add team panels visibiilty and input fields.
  const closePanel = () => {
    setActivePanel(null);
    setTeamName("");
    setPassword("");
    setTeamPassword("");
    setMasterKey("");
  };

  // Updates team positions and streaks based on the game outcome.
  const handleTeamOrderUpdate = async (
    action: "win" | "draw",
    winner: string | null
  ) => {
    let updatedTeams = [...teams];
    let updatedStreak = teamAStreak;

    const resetAll =
      action === "draw" ||
      (action === "win" && winner !== updatedTeams[0]?.teamName);

    if (action === "win" && winner) {
      const winningTeam = updatedTeams.find((team) => team.teamName === winner);
      if (winningTeam) {
        // Increment or reset streak
        updatedStreak =
          winningTeam.teamName === updatedTeams[0].teamName
            ? updatedStreak + 1
            : 1;

        // Reorder teams
        updatedTeams = updatedTeams.filter((team) => team.teamName !== winner);
        const secondTeam = updatedTeams.shift(); // Remove the first team
        updatedTeams.push(secondTeam!); // Add it to the bottom
        updatedTeams.unshift(winningTeam); // Add winning team to the top
      }
    } else if (action === "draw") {
      updatedStreak = 0; // Reset streak on draw
      const [teamA, teamB] = updatedTeams.splice(0, 2); // Get top two teams
      updatedTeams.push(teamB, teamA); // Swap and move to the end
    }

    setTeams(updatedTeams);
    setTeamAStreak(updatedStreak);

    // Prepare data for API
    const orderedTeams = updatedTeams.map((team, index) => ({
      id: team.id,
      position: index + 1,
    }));

    console.log("Sending update to API:", {
      orderedTeams,
      teamName: winner,
      streak: updatedStreak,
      resetAll,
    });

    try {
      // Update positions and streak in the backend
      const response = await fetch("/api/teams", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderedTeams,
          teamName: winner,
          streak: updatedStreak,
          resetAll,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to update team positions or streak in the database"
        );
      }

      console.log("Team positions and streak updated successfully");
    } catch (error) {
      console.error("Error updating team positions or streak:", error);
    }

    setConfirmationVisible(false);
    setSelectedWinner(null);
    setSelectedAction(null);
  };

  // Manage the confirmation panel's visibility.
  const showConfirmationPanel = (
    action: "win" | "draw",
    winner: string | null
  ) => {
    setSelectedAction(action);
    setSelectedWinner(winner);
    setConfirmationVisible(true);
  };

  // Manage the confirmation panel's visibility.
  const closeConfirmationPanel = () => {
    setConfirmationVisible(false);
    setSelectedWinner(null);
    setSelectedAction(null);
  };

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen bg-gray-50">
      {/* Red Flashing Indicator */}
      {gameEnded && timer == 0 && (
        <div className="absolute inset-0 bg-red-600 opacity-50 animate-pulse flex items-center justify-center z-0"></div>
      )}

      {/* Timer and Status Text */}
      <div className="text-center mt-0">
        <div className="text-8xl font-semibold">GAME STATUS</div>
        <div className="border-t-4 border-black my-6 w-3/4 mx-auto"></div>
        <div className="text-9xl font-mono leading-none">
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* Pill Buttons for Team Selection */}
      {(gameActive || timer == 0) && (
        <div className="flex justify-center items-center w-full max-w-4xl mb-20 z-10">
          {teams.length >= 2 ? (
            <>
              <button
                onClick={() => showConfirmationPanel("win", teams[0].teamName)}
                className="flex-1 py-10 text-5xl rounded-l-full border bg-gray-200 hover:bg-gray-300"
              >
                {teams[0].teamName}
              </button>
              <button
                onClick={() => showConfirmationPanel("draw", null)}
                className="flex-1 py-10 text-5xl border bg-gray-200 hover:bg-gray-300"
              >
                Draw
              </button>
              <button
                onClick={() => showConfirmationPanel("win", teams[1].teamName)}
                className="flex-1 py-10 text-5xl rounded-r-full border bg-gray-200 hover:bg-gray-300"
              >
                {teams[1].teamName}
              </button>
            </>
          ) : (
            <p className="text-xl font-semibold">Loading teams...</p>
          )}
        </div>
      )}

      {/* Start Game Button */}
      {!gameActive && !(timer == 0) && (
        <button
          onClick={handleStartGame}
          className="mt-0 mb-20 px-10 py-6 text-8xl bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Start Game
        </button>
      )}

      {/* Confirmation Panel */}
      {confirmationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 max-w-lg">
            <button
              onClick={closeConfirmationPanel}
              className="absolute top-4 right-4"
            >
              ×
            </button>
            <h2 className="text-2xl mb-6">
              {selectedAction === "win" && selectedWinner
                ? `Confirm ${selectedWinner} won?`
                : "Confirm Draw?"}
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeConfirmationPanel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleTeamOrderUpdate(selectedAction!, selectedWinner);
                  handleManualEnd();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plus Minus Buttons */}
      <div className="relative">
        {/* Remove Team Button */}
        <div className="absolute bottom-0 right-80">
          <button
            onClick={() => setActivePanel("remove")}
            className="w-24 h-24 rounded-full text-6xl font-bold hover:opacity-70 bg-[#EBD99F]" // Original color restored
          >
            −
          </button>
        </div>

        {/* Add Team Button */}
        <div className="absolute bottom-0 left-80">
          <button
            onClick={() => setActivePanel("add")}
            className="w-24 h-24 rounded-full text-6xl font-bold hover:opacity-70 bg-[#EBD99F]" // Original color restored
          >
            +
          </button>
        </div>
      </div>

      {/* Add or Remove Panel */}
      {activePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 max-w-lg relative">
            {/* Exit Button */}
            <button
              onClick={closePanel} // Close the panel when clicked
              className="absolute top-4 right-4 text-gray-500 text-3xl hover:text-gray-800 no-shadow"
              style={{ border: "none", background: "none" }} // Remove default button styles
            >
              ×
            </button>

            <h2 className="text-2xl mb-6">
              {activePanel === "add" ? "Add Team" : "Remove Team"}
            </h2>

            {activePanel === "add" ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter team name (12 characters or less)"
                  maxLength={12}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <input
                  type="text"
                  placeholder="Enter 4-digit password"
                  maxLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <button
                  onClick={createTeam}
                  className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Team
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter team to remove"
                  maxLength={12}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <input
                  type="text"
                  placeholder="Enter team password"
                  maxLength={4}
                  value={teamPassword}
                  onChange={(e) => setTeamPassword(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <input
                  type="text"
                  placeholder="Enter master key (optional)"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <button
                  onClick={removeTeam}
                  className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove Team
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPage;
