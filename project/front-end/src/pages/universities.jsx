import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import UniversityCard from '../components/UniversityCard';
import universitiesData from '../data/universities';
import Layout from '../components/Layout';
import '../styles/home.css';
import '../styles/universities.css';

const navLinks = [
  { label: 'Find Universities', href: '#' },
  { label: 'Scholarships', href: '#' },
  { label: 'Forum', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Help', href: '#' },
];

const socialLinks = [
  { icon: 'Globe', href: '#' },
  { icon: 'MessageCircle', href: '#' },
  { icon: 'Image', href: '#' },
  { icon: 'Link2', href: '#' },
];

const quickLinks = [
  { label: 'Universities', href: '#' },
  { label: 'Scholarships', href: '#' },
  { label: 'Majors', href: '#' },
];

const supportLinks = [
  { label: 'About', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Universities() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Highest Rated');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const totalPages = 12;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(
        <button key={1} className="page-btn" onClick={() => handlePageChange(1)}>1</button>
      );
      if (start > 2) pages.push(<span key="start-ellipsis" className="page-ellipsis">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn${i === currentPage ? ' active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className="page-ellipsis">...</span>);
      pages.push(
        <button key={totalPages} className="page-btn" onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <Layout activePage="Find Universities">
      <div className="universities-page">
        <main className="univ-main">
          <div className="univ-container">
            <div className="univ-header">
              <div className="univ-header-left">
                <h1>Universities for &ldquo;IT &amp; Computer Science&rdquo;</h1>
                <p>Showing {universitiesData.length} results found in Cambodia</p>
              </div>
              <div className="univ-header-right">
                <label>Sort By:</label>
                <div className="univ-sort-wrapper">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Highest Rated">Highest Rated</option>
                    <option value="Lowest Tuition">Lowest Tuition</option>
                    <option value="Name A-Z">Name A-Z</option>
                  </select>
                  <ChevronDown size={16} className="univ-sort-icon" />
                </div>
              </div>
            </div>

            <button
              className="univ-mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="univ-layout">
              <div className={`univ-sidebar${mobileFilterOpen ? ' open' : ''}`}>
                <FilterSidebar />
              </div>

              <div className={`univ-sidebar-overlay${mobileFilterOpen ? ' open' : ''}`}
                onClick={() => setMobileFilterOpen(false)}
              />

              <div className="univ-cards-area">
                <div className="univ-cards-grid">
                  {universitiesData.map((uni) => (
                    <UniversityCard key={uni.id} university={uni} />
                  ))}
                </div>

                <div className="univ-pagination">
                  <button
                    className="page-btn page-nav"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {renderPageNumbers()}
                  <button
                    className="page-btn page-nav"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
