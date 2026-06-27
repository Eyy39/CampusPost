import React from "react";
import { DangerIcon } from "./Icons";
import "./DeleteModal.css";

export default function DeleteModal({ target, onConfirm, onCancel }) {
  if (!target) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <DangerIcon />
        </div>
        <h3 className="modal-title">Delete Application?</h3>
        <p className="modal-desc">This action cannot be undone.</p>
        <p className="modal-app-name">{target.university} &middot; {target.major}</p>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onCancel}>No, Cancel</button>
          <button className="btn-modal-delete" onClick={() => onConfirm(target)}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
