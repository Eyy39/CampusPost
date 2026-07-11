import React, { useEffect, useState } from 'react';
import { UserCircle2, Mail, GraduationCap, CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchCurrentUser } from '../api/auth';
import '../styles/profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('campuspost_token');
    const savedUser = localStorage.getItem('campuspost_user');

    if (savedUser) {
      setProfile(JSON.parse(savedUser));
    }

    if (token) {
      fetchCurrentUser(token)
        .then((user) => setProfile(user))
        .catch(() => {
          const fallback = savedUser ? JSON.parse(savedUser) : null;
          if (fallback) setProfile(fallback);
        });
    }
  }, []);

  if (!profile) {
    return (
      <Layout activePage="Profile">
        <div className="profile-page">
          <div className="profile-panel">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Student';
  const university = profile.university || 'Royal University of Phnom Penh';
  const major = profile.major || 'Computer Science';
  const status = profile.status || 'Application in Progress';
  const joined = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently joined';

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
              <h1>{displayName}</h1>
              <p>Student profile and application overview</p>
              <div className="profile-meta">
                <span>
                  <Mail size={16} />
                  {profile.email}
                </span>
                <span>
                  <GraduationCap size={16} />
                  {university}
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
                <span>{major}</span>
              </li>
              <li>
                <strong>Current Status</strong>
                <span>{status}</span>
              </li>
              <li>
                <strong>Joined</strong>
                <span>{joined}</span>
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
