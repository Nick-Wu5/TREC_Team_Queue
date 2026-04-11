"use client";

import React, { useState, useEffect } from "react";
import TeamList from "./components/teamList";
import Header from "./components/Header";
import ClockDisplay from "./components/ClockDisplay";
import Image from "next/image";
import { useTeams, useGameState } from "../utils/hooks";
import type { Team } from "@/types";

/**
 * Home Page
 *
 * Main display for the queue and game status.
 */

export default function Home() {
  const [teamsState, setTeamsState] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{
    teamA: string;
    teamB: string;
  }>({
    teamA: "",
    teamB: "",
  });
  const [teamAStreak, setTeamAStreak] = useState(0);
  const [timer, setTimer] = useState<number>(420);
  const [gameEnded, setGameEnded] = useState(false);

  const { teams } = useTeams();
  const { gameState } = useGameState();

  useEffect(() => {
    if (teams.length) {
      setTeamsState(teams);
      setSelectedTeams({
        teamA: teams[0].teamName,
        teamB: teams[1]?.teamName ?? "",
      });
      setTeamAStreak(teams[0].streak ?? 0);
    }
  }, [teams]);

  useEffect(() => {
    if (gameState) {
      setTimer(gameState.timer);
      setGameEnded(gameState.game_ended);
    }
  }, [gameState]);

  const mainListTeams = teamsState.slice(0, 5).map((t) => t.teamName);
  const additionalTeamsCount =
    teamsState.length > 5 ? teamsState.length - 5 : 0;

  return (
    <div className="main-container flex flex-col">
      {/* Red Flashing Indicator */}
      {gameEnded && timer <= 0 && (
        <div className="absolute inset-0 bg-red-600 opacity-50 animate-pulse flex items-center justify-center z-0" />
      )}

      {/* Header */}
      <div className="flex justify-center mt-10">
        <Header
          selectedTeams={selectedTeams}
          time={`${Math.floor(timer / 60)}:${(timer % 60)
            .toString()
            .padStart(2, "0")}`}
          teamAStreak={teamAStreak}
        />
      </div>

      {/* Next Up Text */}
      <div
        className="text-3xl font-semibold mt-5 mb-5"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        NEXT UP
      </div>

      {/* Left Purdue Pete & Time, Centered Team List, Right Rec Logo */}
      <main className="flex items-center flex-1">
        <div className="left-section">
          <Image
            src="/purduePete.png"
            alt="Purdue Pete"
            className="footer-image-left"
            width={250}
            height={400}
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
          <Image
            src="/son.jpeg"
            alt="Purdue Rec Logo"
            className="footer-image-right"
            width={250}
            height={250}
          />
        </div>
      </main>
    </div>
  );
}
