import React from "react";

/**
 * Capsule component displays a team name in a styled pill-shaped capsule.
 * This component is designed to show a single piece of text. It takes a
 * `text` prop which should contain the name of the team.
 *
 * @component
 * @param {string} props.text - The name of the team to display in the capsule.
 *
 * @returns {JSX.Element} The rendered capsule element containing the team name.
 */
interface CapsuleProps {
  text: string;
}

const Capsule: React.FC<CapsuleProps> = ({ text }) => {
  return <div className={"capsule"}>{text}</div>;
};

export default Capsule;
