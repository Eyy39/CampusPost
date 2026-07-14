import React, { useEffect, useState, useRef } from 'react';
import { UserCircle2, Mail, Phone, CalendarDays, Edit3, Save, X, CheckCircle, Camera } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { saveAuthSession } from '../api/auth';
import '../styles/profile.css';

const API_BASE = "http://localhost:4000/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('campuspost_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setProfile(user);
      setForm({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' });
    }
    api.get('/auth/me').then((user) => {
      setProfile(user);
      setForm({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' });
      localStorage.setItem('campuspost_user', JSON.stringify(user));
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updated = await api.put('/auth/profile', form);
      setProfile(updated);
      localStorage.setItem('campuspost_user', JSON.stringify(updated));
      setEditing(false);
      setMsg('Profile updated successfully');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ first_name: profile.first_name || '', last_name: profile.last_name || '', phone: profile.phone || '' });
    setEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('campuspost_token');
      const res = await fetch(`${API_BASE}/auth/profile-picture`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Upload failed');
      }
      const updated = await res.json();
      setProfile(updated);
      localStorage.setItem('campuspost_user', JSON.stringify(updated));
      setMsg('Profile picture updated successfully');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.message || 'Failed to upload picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
  const joined = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently joined';

  return (
    <Layout activePage="Profile">
      <div className="profile-page">
        <div className="profile-hero">
          <div className="profile-card">
            <div className="profile-avatar" onClick={handlePhotoClick} style={{ cursor: 'pointer', position: 'relative' }}>
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt="Profile" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <UserCircle2 size={82} />
              )}
              <div className="profile-avatar-overlay">
                <Camera size={20} />
              </div>
              {uploading && <div className="profile-avatar-loading">Uploading...</div>}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </div>
            <div className="profile-card-content">
              <h1>{displayName}</h1>
              <p>Student profile and application overview</p>
              <div className="profile-meta">
                <span><Mail size={16} /> {profile.email}</span>
                <span><Phone size={16} /> {profile.phone || 'No phone'}</span>
                <span><CalendarDays size={16} /> Joined {joined}</span>
              </div>
            </div>
          </div>
        </div>

        {msg && (
          <div style={{ maxWidth: 1120, margin: '0 auto 16px', padding: '12px 16px', borderRadius: 12, background: msg.includes('Failed') ? '#FEF2F2' : '#F0FDF4', color: msg.includes('Failed') ? '#DC2626' : '#16A34A', fontSize: 14 }}>
            {msg}
          </div>
        )}

        <div className="profile-grid" style={{ maxWidth: 1120, margin: '0 auto' }}>
          <section className="profile-panel" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>Personal Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid #e4ecf8', background: 'white', color: '#1e4da0', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  <Edit3 size={16} /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 10, border: '1px solid #e4ecf8', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>
                    <X size={14} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 10, border: 'none', background: '#1e4da0', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                    <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="profile-field">
                <label>First Name</label>
                {editing ? (
                  <input className="profile-input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                ) : (
                  <div className="profile-value">{profile.first_name || '—'}</div>
                )}
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                {editing ? (
                  <input className="profile-input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                ) : (
                  <div className="profile-value">{profile.last_name || '—'}</div>
                )}
              </div>
              <div className="profile-field">
                <label>Email</label>
                <div className="profile-value" style={{ color: '#94a3b8' }}>{profile.email}</div>
              </div>
              <div className="profile-field">
                <label>Phone</label>
                {editing ? (
                  <input className="profile-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                ) : (
                  <div className="profile-value">{profile.phone || '—'}</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
