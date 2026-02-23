import React from "react";
import "../styles/ExportConfirmationModal.css";

const ExportConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Export Confirmation</h3>
        <p>
          Are you sure you want to export this data? This will generate a
          downloadable file.
        </p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-btn" onClick={onConfirm}>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportConfirmationModal;
