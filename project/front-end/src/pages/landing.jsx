import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LogoIcon } from '../components/Icons';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="lp">
      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo" onClick={() => navigate('/')}>
            <LogoIcon size={28} />
            <div className="logo"><span className="logo-gradient">Campus</span><span className="logo-accent">Post</span></div>
          </div>
          <div className="lp-nav-actions">
            <button className="lp-nav-login" onClick={() => navigate('/login')}>Login</button>
            <button className="lp-nav-signup" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <div className="lp-hero-orb lp-hero-orb-1" />
          <div className="lp-hero-orb lp-hero-orb-2" />
          <div className="lp-hero-orb lp-hero-orb-3" />
        </div>
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">
            <Sparkles size={14} />
            Trusted by 10,000+ Cambodian students
          </div>
          <h1>
            Your Future University<br />
            is <span className="lp-hero-highlight">One Search</span> Away
          </h1>
          <p>
            Discover 50+ universities, compare programs, find scholarships,
            and apply online — all from one place.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-hero" onClick={() => navigate('/home')}>
              <Search size={18} />
              Explore Universities
            </button>
            <button className="lp-btn-hero-ghost" onClick={() => navigate('/signup')}>
              Sign Up Free
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="lp-hero-proof">
            <div className="lp-hero-avatars">
              <div className="lp-hero-avatar" style={{backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')"}} />
              <div className="lp-hero-avatar" style={{backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')"}} />
              <div className="lp-hero-avatar" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')"}} />
            </div>
            <span>Join <strong>10,000+</strong> students already exploring</span>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-hero-img">
            <img
              src="https://i.pinimg.com/736x/78/1e/7b/781e7bb190e8469d15d27a7219914af5.jpg"
              alt="Students at university"
            />
          </div>
          <div className="lp-hero-card lp-hero-card-1">
            <div className="lp-hero-card-icon" style={{background:'#dbeafe',color:'#FDCC0D'}}>
              <Star size={18} />
            </div>
            <div>
              <strong>600+ Scholarships</strong>
              <small>Fully funded opportunities</small>
            </div>
          </div>
          <div className="lp-hero-card lp-hero-card-2">
            <div className="lp-hero-card-icon" style={{background:'#dcfce7',color:'#10B981'}}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <strong>Apply in Minutes</strong>
              <small>Guided 6-step process</small>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="lp-stats">
        <div className="lp-stats-inner">
          <div className="lp-stat"><strong>50+</strong> Universities</div>
          <div className="lp-stat-divider" />
          <div className="lp-stat"><strong>200+</strong> Scholarships</div>
          <div className="lp-stat-divider" />
          <div className="lp-stat"><strong>1,000+</strong> Programs</div>
          <div className="lp-stat-divider" />
          <div className="lp-stat"><strong>5K+</strong> Reviews</div>
        </div>
      </section>

      {/* HOW IT WORKS - 3 steps */}
      <section className="lp-steps">
        <div className="lp-container">
          <div className="lp-steps-header">
            <h2>How CampusPost Works</h2>
            <p>From search to acceptance in three simple steps</p>
          </div>
          <div className="lp-steps-row">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <div className="lp-step-line" />
              <h3>Search</h3>
              <p>Browse universities, programs, and scholarships across Cambodia.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <div className="lp-step-line" />
              <h3>Discover</h3>
              <p>Explore scholarships, programs, and opportunities you never knew existed.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <h3>Apply</h3>
              <p>Submit your application online and track it until you get accepted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final">
        <div className="lp-final-bg" />
        <div className="lp-container lp-final-content">
          <h2>Start Your Journey Today</h2>
          <p>Join thousands of Cambodian students who found their path through CampusPost.</p>
          <div className="lp-final-actions">
            <button className="lp-btn-final" onClick={() => navigate('/home')}>
              Get Started Free
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="lp-final-trust">
            <span><CheckCircle2 size={14} /> Free forever</span>
            <span><CheckCircle2 size={14} /> No credit card needed</span>
            <span><CheckCircle2 size={14} /> 10,000+ students</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <p>&copy; {new Date().getFullYear()} CampusPost. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
