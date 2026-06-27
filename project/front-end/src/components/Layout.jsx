import React from "react";
import { useNavigate } from "react-router-dom";
import { LogoIcon } from "./Icons";
import "./Layout.css";

export function Navbar({ activePage }) {
  const navigate = useNavigate();
  const links = [
    { label: "Find Universities", path: "/universities" },
    { label: "Scholarships", path: "/scholarships" },
    { label: "Forum", path: "/forum" },
    { label: "About", path: "/about" },
    { label: "My Applications", path: "/my-applications" },
  ];

  return (
    <nav className="nav nav-padding">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <LogoIcon />
        <div className="logo">Campus<span className="logo-accent">Post</span></div>
      </div>
      <ul className="nav-links">
        {links.map((link) => (
          <li
            key={link.label}
            className={link.label === activePage ? "nav-link-active" : "nav-link"}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner footer-grid">
        <div>
          <div className="footer-logo">Campus<span style={{ color: "#8BB8F0" }}>Post</span></div>
          <p className="footer-text">
            Helping Cambodian students compare universities, scholarships, and complete university applications in one platform.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Resources</div>
          <ul className="footer-links">
            <li className="footer-link">About</li>
            <li className="footer-link">Universities</li>
            <li className="footer-link">Scholarships</li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Legal</div>
          <ul className="footer-links">
            <li className="footer-link">Terms</li>
            <li className="footer-link">Privacy Policy</li>
            <li className="footer-link">Design Guidelines</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CampusPost. All rights reserved.
      </div>
    </footer>
  );
}
