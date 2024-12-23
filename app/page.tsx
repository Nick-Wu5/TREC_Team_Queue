"use client";

import React, { useState, useEffect } from "react";
import TeamList from "./components/teamList";
import Header from "./components/Header";
import ClockDisplay from "./components/ClockDisplay";
import { supabase } from "../utils/supabase-js";

/**
 * Home Page
 *
 * This component serves as the main user-facing page of the application. It dynamically displays
 * the team order and a countdown timer while integrating with real-time updates
 * and a backend database. The page is styled and structured to enhance user experience for
 * managing pickup soccer within the TREC.
 *
 * @returns {JSX.Element} The rendered home page component displaying team data and game status.
 */
const timerChannel = new BroadcastChannel("game_timer_channel");

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]); // Stores the list of all teams fetched from the backend.

  const [selectedTeams, setSelectedTeams] = useState<{
    teamA: string;
    teamB: string;
  }>({
    teamA: "",
    teamB: "",
  }); // Holds the currently playing teams (Team A and Team B).
  const [teamAStreak, setTeamAStreak] = useState(0); // Tracks the win streak for the reigning team.
  const [timer, setTimer] = useState(420); // Manages the game timer (in seconds) default 7 minutes.
  const [gameActive, setGameActive] = useState(false); // Booleans for game state tracking.
  const [gameEnded, setGameEnded] = useState(false);

  // Fetch teams from the backend
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
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  // Fetch teams on component mount and set interval
  useEffect(() => {
    fetchTeams();
    const intervalId = setInterval(fetchTeams, 1000); // Fetch every second
    return () => clearInterval(intervalId);
  }, []);

  // Update selected teams when teams change
  useEffect(() => {
    if (teams.length > 1) {
      setSelectedTeams({ teamA: teams[0].teamName, teamB: teams[1].teamName });
    }
  }, [teams]);

  // Update win streak upon game completion
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const teamA = teams[0]?.teamName;
        if (!teamA) return;

        const { data, error } = await supabase
          .from("teams")
          .select("streak")
          .eq("teamName", teamA);

        if (error) {
          console.error("Error fetching streak:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setTeamAStreak(data[0].streak);
        } else {
          setTeamAStreak(0); // Default to 0 if no streak is found
        }
      } catch (err) {
        console.error("Error fetching streak:", err);
      }
    };

    fetchStreak();
    const intervalId = setInterval(fetchStreak, 200);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [teams[0]?.teamName]); // Dependency on teamA

  // Listen for timer updates from the Control Page
  useEffect(() => {
    const handleTimerMessage = (event: MessageEvent) => {
      const {
        timer: newTimer,
        gameActive: isActive,
        gameEnded: hasEnded,
      } = event.data;
      setTimer(newTimer);
      setGameActive(isActive);
      setGameEnded(hasEnded);
    };

    timerChannel.addEventListener("message", handleTimerMessage);

    return () => {
      // Remove the event listener only, don't close the channel
      timerChannel.removeEventListener("message", handleTimerMessage);
    };
  }, []);

  // Prepare teams for being displayed
  const mainListTeams = teams.slice(2, 7).map((team) => team.teamName);
  const additionalTeamsCount = teams.length - 7;

  return (
    <div className="main-container flex flex-col min-h-screen p-5 sm:p-20">
      {/* Red Flashing Indicator */}
      {gameEnded && timer == 0 && (
        <div className="absolute inset-0 bg-red-600 opacity-50 animate-pulse flex items-center justify-center z-0"></div>
      )}

      <Header
        selectedTeams={selectedTeams}
        time={`${Math.floor(timer / 60)}:${(timer % 60)
          .toString()
          .padStart(2, "0")}`}
        teamAStreak={teamAStreak}
      />

      {/* Next Up Text */}
      <div
        className="text-3xl font-semibold mt-5 mb-5"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        NEXT UP
      </div>

      {/* Left Purdue Pete & Time, Centered Team List, Right Rec Logo*/}
      <main className="flex items-center flex-1">
        <div className="left-section">
          <img
            src="/purduePete.png"
            alt="Purdue Pete"
            className="footer-image-left"
          />
          <ClockDisplay />
        </div>
        <div className="team-list-container flex flex-col items-center">
          <TeamList
            teams={mainListTeams}
            additionalTeamsCount={additionalTeamsCount}
          />
        </div>
        <div className="right-section">
          <img
            src="/PurdueRecLogo.png"
            alt="Purdue Rec Logo"
            className="footer-image-right"
          />
        </div>
      </main>
    </div>
  );
}
