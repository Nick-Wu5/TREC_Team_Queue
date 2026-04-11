import React from "react";

interface RemoveTeamPanelProps {
  teamName: string;
  teamPassword: string;
  masterKey: string;
  setTeamName: (name: string) => void;
  setTeamPassword: (pw: string) => void;
  setMasterKey: (key: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const RemoveTeamPanel: React.FC<RemoveTeamPanelProps> = ({
  teamName,
  teamPassword,
  masterKey,
  setTeamName,
  setTeamPassword,
  setMasterKey,
  onSubmit,
  onClose,
}) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-2">Remove Team</h2>
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
      value={teamPassword}
      onChange={(e) => setTeamPassword(e.target.value)}
    />
    <input
      className="border p-2 mb-2 w-full"
      placeholder="Master Key"
      type="password"
      value={masterKey}
      onChange={(e) => setMasterKey(e.target.value)}
    />
    <button
      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
      onClick={onSubmit}
    >
      Remove
    </button>
    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
      Cancel
    </button>
  </div>
);
