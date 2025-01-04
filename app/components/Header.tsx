import React from "react";
import Capsule from "./Capsule";
import WinStreak from "./WinStreak";

/**
 * Header component displays a visual representation of the selected teams, the current time,
 * and additional information like win streaks.
 *
 * @component
 * @param {HeaderProps} props - The props for the component.
 * @param {Object} props.selectedTeams - An object containing the names of Team A and Team B.
 * @param {string} props.time - The current time to display in the header.
 * @param {number} props.teamAStreak - The win streak count for Team A. A value greater than 0 triggers the win streak indicator.
 *
 * @returns {JSX.Element} The rendered Header component showing team names, a timer, and optional win streak.
 */
interface HeaderProps {
  selectedTeams: { teamA: string; teamB: string };
  time: string;
  teamAStreak: number;
}

const Header: React.FC<HeaderProps & { teamAStreak: number }> = ({
  selectedTeams,
  time,
  teamAStreak,
}) => {
  return (
    <div className="header flex justify-center items-center w-full bg-gray-100 rounded">
      {/* Wrapper for left capsule and line */}
      <div className="flex items-center mr-4 relative">
        {teamAStreak > 1 && <WinStreak streakCount={teamAStreak} />}
        <Capsule text={selectedTeams.teamA} />
        <div
          className="h-1 w-20 bg-black ml-2"
          style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
        ></div>
      </div>

      {/* Centered Timer*/}
      <div className="flex flex-col items-center mx-1">
        <div
          className="timer text-8xl font-mono"
          style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
        >
          {time}
        </div>
      </div>

      {/* Wrapper for right line and capsule */}
      <div className="flex items-center ml-4">
        <div
          className="h-1 w-20 bg-black mr-2"
          style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
        ></div>
        <Capsule text={selectedTeams.teamB} />
      </div>
    </div>
  );
};

export default Header;
