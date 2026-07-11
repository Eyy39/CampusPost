import React from 'react';
import { UserCircle2, Mail, GraduationCap, CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import '../styles/profile.css';

export default function Profile() {
  const profile = {
    name: 'Sokha Chheng',
    email: 'sokha@student.edu.kh',
    university: 'Royal University of Phnom Penh',
    major: 'Computer Science',
    status: 'Application in Progress',
    joined: 'March 2026',
  };

  return (
    <Layout activePage="Profile">
      <div className="profile-page">
        <div className="profile-hero">
          <div className="profile-card">
            <div className="profile-avatar">
              <UserCircle2 size={82} />
            </div>
            <div className="profile-card-content">
              <div className="profile-badge">
                <Sparkles size={16} />
                Welcome back
              </div>
              <h1>{profile.name}</h1>
              <p>Student profile and application overview</p>
              <div className="profile-meta">
                <span>
                  <Mail size={16} />
                  {profile.email}
                </span>
                <span>
                  <GraduationCap size={16} />
                  {profile.university}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <section className="profile-panel">
            <h2>Academic Information</h2>
            <ul className="profile-list">
              <li>
                <strong>Major</strong>
                <span>{profile.major}</span>
              </li>
              <li>
                <strong>Current Status</strong>
                <span>{profile.status}</span>
              </li>
              <li>
                <strong>Joined</strong>
                <span>{profile.joined}</span>
              </li>
            </ul>
          </section>

          <section className="profile-panel">
            <h2>Next Steps</h2>
            <div className="profile-steps">
              <div className="profile-step">
                <ShieldCheck size={18} />
                <div>
                  <h3>Complete your application</h3>
                  <p>Review your uploaded documents and submit before the deadline.</p>
                </div>
              </div>
              <div className="profile-step">
                <CalendarDays size={18} />
                <div>
                  <h3>Track scholarship opportunities</h3>
                  <p>Keep an eye on scholarships that match your profile and goals.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
