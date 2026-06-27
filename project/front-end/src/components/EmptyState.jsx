import React from "react";
import { PlusIcon } from "./Icons";
import "./EmptyState.css";

export default function EmptyState({ onCreate }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h2 className="empty-title">No Applications Yet</h2>
      <p className="empty-desc">
        Start your first university application to track your admission progress.
      </p>
      <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14, margin: "0 auto" }} onClick={onCreate}>
        <PlusIcon /> Create Application
      </button>
    </div>
  );
}
