import React from "react";

interface UnderDevelopmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const UnderDevelopmentDialog: React.FC<UnderDevelopmentDialogProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs text-center">
        <h2 className="text-xl font-semibold mb-4">Under Development</h2>
        <p className="mb-6">This feature is currently under development.</p>
        <button
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition"
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default UnderDevelopmentDialog;
