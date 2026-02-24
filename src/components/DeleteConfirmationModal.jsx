import React from "react";
import "../styles/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={isProcessing}>
            {cancelLabel}
          </button>
          <button
            className={`delete-btn delete-btn--${confirmVariant}`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
