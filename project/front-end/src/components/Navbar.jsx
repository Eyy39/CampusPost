import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Menu, X } from 'lucide-react';

const defaultLinks = [
  { label: 'Find Universities', to: '/universities' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Programs', to: '/programs' },
  { label: 'About', to: '/about' },
  { label: 'My Applications', to: '/my-applications' },
];

export default function Navbar({ links: customLinks, simple, noSearch, rightContent }) {
  const navigate = useNavigate();
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
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">
              <GraduationCap size={20} />
            </span>
            CampusPost
          </Link>

          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
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
                <button className="navbar-btn navbar-btn-login" onClick={() => navigate('/login')}>Log In</button>
                {!simple && <button className="navbar-btn navbar-btn-register" onClick={() => navigate('/signup')}>Register</button>}
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
              <Link to={link.to} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-actions">
          <button className="navbar-btn navbar-btn-login" onClick={() => navigate('/login')}>Log In</button>
          <button className="navbar-btn navbar-btn-register" onClick={() => navigate('/signup')}>Register</button>
        </div>
      </div>
    </>
  );
}
