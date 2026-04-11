import React from "react";

interface AddTeamPanelProps {
  teamName: string;
  password: string;
  setTeamName: (name: string) => void;
  setPassword: (pw: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const AddTeamPanel: React.FC<AddTeamPanelProps> = ({
  teamName,
  password,
  setTeamName,
  setPassword,
  onSubmit,
  onClose,
}) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-2">Add Team</h2>
    <input
      className="border p-2 mb-2 w-full"
      placeholder="Team Name"
      value={teamName}
      onChange={(e) => setTeamName(e.target.value)}
    />
    <input
      className="border p-2 mb-2 w-full"
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      onClick={onSubmit}
    >
      Add
    </button>
    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
      Cancel
    </button>
  </div>
);
