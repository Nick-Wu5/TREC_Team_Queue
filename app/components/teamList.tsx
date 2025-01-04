import React from "react";
import Capsule from "./Capsule";

/**
 * TeamList component renders a list of teams using the Capsule component.
 * This component takes an array of team names as a prop and displays each name
 * inside a styled capsule, stacking them vertically.
 *
 * @component
 * @param {string[]} props.teams - An array of team names to display.
 * @param {number} props.additionalTeamsCount - Counts teams after 5+ are in list
 *
 * @returns {JSX.Element} The rendered list of team capsules.
 */
interface TeamListProps {
  teams: string[];
  additionalTeamsCount: number;
}

const TeamList: React.FC<TeamListProps> = ({ teams, additionalTeamsCount }) => {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      {/* Render the provided teams (up to 5) as capsules */}
      {teams.map((team, index) => (
        <div key={index} className="flex-shrink">
          <Capsule text={team} />
        </div>
      ))}

      {/* Conditionally render the "and x more teams..." capsule if there are additional teams */}
      {additionalTeamsCount > 0 && (
        <div className="flex-shrink-0">
          <Capsule text={`and ${additionalTeamsCount} more...`} />
        </div>
      )}
    </div>
  );
};

export default TeamList;
