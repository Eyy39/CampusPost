import React from "react";
import { useNavigate } from "react-router-dom";
import { DocumentIcon } from "./Icons";
import "./Sidebar.css";

export default function Sidebar({ currentStep, formData }) {
  const navigate = useNavigate();
  const uploadedCount = Object.values(formData.documents).filter(Boolean).length;

  return (
    <div className="sidebar sidebar-sticky">
      <div className="sidebar-card">
        <span className="badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <circle cx="5" cy="5" r="4" />
          </svg>
          {currentStep > 5 ? "Submitted" : "In Progress"}
        </span>
        <div className="uni-row">
          <div className="uni-logo">PI</div>
          <div>
            <div style={{ fontSize: 11, color: "#6E8098", marginBottom: 1 }}>Applying To</div>
            <div className="uni-name">Paragon International University</div>
          </div>
        </div>
        <div style={{ marginTop: 4 }}>
          <div className="info-row">
            <span className="info-label">Intake Year</span>
            <span className="info-value">2024</span>
          </div>
          <div className="info-row">
            <span className="info-label">Degree Level</span>
            <span className="info-value">Bachelor's</span>
          </div>
          <div className="info-row">
            <span className="info-label">Faculty</span>
            <span className="info-value">Computer Science</span>
          </div>
          <div className="info-row-last">
            <span className="info-label">Application ID</span>
            <span className="info-value">CP-2024-7F3A</span>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#243B5A", margin: "0 0 4px" }}>
          Required Documents
        </h3>
        <p style={{ fontSize: 12, color: "#6E8098", margin: "0 0 12px" }}>
          Upload scanned copies in PDF or image format.
        </p>
        <div>
          {[
            "National ID / Passport",
            "High School Transcript",
            "Bac II Certification",
            "Your Photo",
          ].map((doc, i, arr) => (
            <div key={doc} className={i < arr.length - 1 ? "doc-item" : "doc-item-last"}>
              <DocumentIcon /> {doc}
            </div>
          ))}
        </div>
        <div className="doc-count">{uploadedCount} of 4 documents uploaded</div>
      </div>

      <div className="sidebar-card sidebar-actions-card">
        <button className="sidebar-btn sidebar-btn-login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="sidebar-btn sidebar-btn-signup" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
