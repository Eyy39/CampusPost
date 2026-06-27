import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Menu, X } from 'lucide-react';

const defaultLinks = [
  { label: 'Find Universities', href: '#' },
  { label: 'Scholarships', href: '#' },
  { label: 'Programs', href: '#' },
  { label: 'About', href: '#' },
  { label: 'My Applications', href: '#' },
];

export default function Navbar({ links: customLinks, simple, noSearch, rightContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = customLinks || defaultLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-logo">
            <span className="logo-icon">
              <GraduationCap size={20} />
            </span>
            CampusPost
          </a>

          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {!noSearch && (
              <div className="navbar-search">
                <Search size={18} />
                <input type="text" placeholder="Search..." />
              </div>
            )}
            {rightContent || (
              <>
                <button className="navbar-btn navbar-btn-login">Log In</button>
                {!simple && <button className="navbar-btn navbar-btn-register">Register</button>}
              </>
            )}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <ul className="mobile-menu-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-actions">
          <button className="navbar-btn navbar-btn-login">Log In</button>
          <button className="navbar-btn navbar-btn-register">Register</button>
        </div>
      </div>
    </>
  );
}
