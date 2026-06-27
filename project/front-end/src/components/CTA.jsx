import React from 'react';
import { Search, UserPlus, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-background" />
      <div className="cta-pattern" />

      <div className="cta-content reveal">
        <h2>Ready to Begin Your Journey?</h2>
        <p>
          Join thousands of Cambodian students who have found their path
          to higher education. Start exploring today.
        </p>
        <div className="cta-buttons">
          <button className="btn btn-accent btn-lg">
            <Search size={20} />
            Start Searching
          </button>
          <button className="btn btn-outline btn-lg">
            <UserPlus size={20} />
            Create Account
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
