import React from 'react';
import {
  Monitor,
  Briefcase,
  Cog,
  HeartPulse,
  Scale,
  Building2,
  GraduationCap,
  Compass,
} from 'lucide-react';

const programs = [
  {
    name: 'Information Technology',
    desc: 'Software development, AI, networking & cybersecurity',
    icon: Monitor,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Business',
    desc: 'Management, finance, marketing & entrepreneurship',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Engineering',
    desc: 'Civil, electrical, mechanical & software engineering',
    icon: Cog,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Medicine',
    desc: 'General medicine, surgery, pharmacy & nursing',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Law',
    desc: 'Legal studies, criminology & international law',
    icon: Scale,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Architecture',
    desc: 'Architectural design, urban planning & landscape',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Education',
    desc: 'Teaching, curriculum design & educational leadership',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Tourism',
    desc: 'Hospitality, travel management & cultural heritage',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

export default function ProgramSection() {
  return (
    <section className="program-section">
      <div className="container">
        <div className="section-header reveal">
          <h2>Explore Programs</h2>
          <p>Find your passion across a wide range of academic disciplines</p>
        </div>
        <div className="programs-grid">
          {programs.map((prog, index) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.name}
                className={`program-card reveal reveal-delay-${(index % 4) + 1}`}
              >
                <div
                  className="program-card-image"
                  style={{ backgroundImage: `url('${prog.image}')` }}
                />
                <div className="program-card-overlay" />
                <div className="program-card-content">
                  <div className="program-card-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{prog.name}</h3>
                  <p>{prog.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
