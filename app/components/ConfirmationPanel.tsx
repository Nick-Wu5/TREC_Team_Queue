import React from "react";

interface ConfirmationPanelProps {
  action: "win" | "draw";
  winner: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationPanel: React.FC<ConfirmationPanelProps> = ({
  action,
  winner,
  onConfirm,
  onCancel,
}) => (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-2">Confirm Action</h2>
    <p className="mb-4">
      {action === "win"
        ? `Confirm win for ${winner}`
        : "Confirm draw between teams"}
    </p>
    <button
      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      onClick={onConfirm}
    >
      Confirm
    </button>
    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
      Cancel
    </button>
  </div>
);
