import React from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Image,
  Link2,
} from 'lucide-react';

const defaultQuickLinks = [
  { label: 'Find Universities', href: '#' },
  { label: 'Scholarships', href: '#' },
  { label: 'Programs', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'FAQ', href: '#' },
];

const defaultSupportLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'Student Guide', href: '#' },
];

const defaultSocialLinks = [
  { icon: Globe, href: '#' },
  { icon: MessageCircle, href: '#' },
  { icon: Image, href: '#' },
  { icon: Link2, href: '#' },
];

export default function Footer({
  quickLinks = defaultQuickLinks,
  supportLinks = defaultSupportLinks,
  socialLinks = defaultSocialLinks,
  description,
  hideContact,
}) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-about">
          <h3>
            <span className="logo-icon">
              <GraduationCap size={18} />
            </span>
            CampusPost
          </h3>
          <p>
            {description ||
              "CampusPost is Cambodia's leading platform helping students explore universities, scholarships and academic opportunities."}
          </p>
          <div className="footer-social">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <a key={index} href={item.href} aria-label={`Social link ${index + 1}`}>
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul className="footer-links">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {!hideContact && (
          <div>
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <MapPin size={18} />
              <span>123 Preah Monivong Blvd, Phnom Penh, Cambodia</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} />
              <span>+855 23 456 789</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} />
              <span>hello@campuspost.edu.kh</span>
            </div>
          </div>
        )}
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CampusPost. Empowering Academic Journeys.</p>
      </div>
    </footer>
  );
}
