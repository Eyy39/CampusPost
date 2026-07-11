import React from "react";
import { useNavigate } from "react-router-dom";
import { DocumentIcon } from "./Icons";
import "./Sidebar.css";

export default function Sidebar({ currentStep, formData }) {
  const navigate = useNavigate();
  const uploadedCount = Object.values(formData.documents).filter(Boolean).length;

  const initials = (formData.fullName || "NA")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
          <div className="uni-logo">{initials}</div>
          <div>
            <div style={{ fontSize: 11, color: "#6E8098", marginBottom: 1 }}>Applying To</div>
            <div className="uni-name">{formData.university || "Not selected yet"}</div>
          </div>
        </div>
        <div style={{ marginTop: 4 }}>
          <div className="info-row">
            <span className="info-label">Intake Year</span>
            <span className="info-value">{formData.intakeYear || "—"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Degree Level</span>
            <span className="info-value">{formData.degreeLevel || "—"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Major</span>
            <span className="info-value">{formData.major || "—"}</span>
          </div>
          <div className="info-row-last">
            <span className="info-label">Name</span>
            <span className="info-value">{formData.fullName || "—"}</span>
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

      {!localStorage.getItem("campuspost_token") && (
        <div className="sidebar-card sidebar-actions-card">
          <p style={{ fontSize: 13, color: "#6E8098", margin: "0 0 8px", textAlign: "center" }}>
            You need an account to submit your application.
          </p>
          <button className="sidebar-btn sidebar-btn-signup" onClick={() => navigate("/signup")}>
            Sign Up to Apply
          </button>
          <p style={{ fontSize: 12, color: "#6E8098", margin: "8px 0 0", textAlign: "center" }}>
            Already have an account?{" "}
            <span style={{ color: "#2563EB", cursor: "pointer" }} onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
