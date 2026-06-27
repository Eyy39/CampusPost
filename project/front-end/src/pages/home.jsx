import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import FeaturedUniversities from '../components/FeaturedUniversities';
import ScholarshipSection from '../components/ScholarshipSection';
import ProgramSection from '../components/ProgramSection';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import '../styles/home.css';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <FeaturedUniversities />
        <ScholarshipSection />
        <ProgramSection />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
