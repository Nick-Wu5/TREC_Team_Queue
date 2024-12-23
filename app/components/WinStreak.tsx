import React, { useState, useEffect } from "react";
import "../styles/WinStreak.css";

/**
 * WinStreak component visually displays a team's win streak with an animated
 * fire icon and the streak count.
 *
 * @component
 * @param {WinStreakProps} props - The props for the component.
 * @param {number} props.streakCount - The current win streak count for a team.
 *
 * @returns {JSX.Element} The rendered WinStreak component showing a fire icon and the streak count.
 */
interface WinStreakProps {
  streakCount: number;
}

const WinStreak: React.FC<WinStreakProps> = ({ streakCount }) => {
  const [animate, setAnimate] = useState(false); //determines if the animation should run

  useEffect(() => {
    if (streakCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 800); // Reset animation
      return () => clearTimeout(timer);
    }
  }, [streakCount]);

  return (
    <div className={`win-streak ${animate ? "animate" : ""}`}>
      <div className="fire-icon-container">
        <img src="/fire-icon.png" alt="streakIcon" className="fire-icon" />
        <span className="streak-number">{streakCount}</span>
      </div>
    </div>
  );
};

export default WinStreak;
