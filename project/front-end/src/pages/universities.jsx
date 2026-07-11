import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import UniversityCard from '../components/UniversityCard';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import '../styles/home.css';
import '../styles/universities.css';

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Highest Rated');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const perPage = 6;

  useEffect(() => {
    api.get('/universities')
      .then((data) => {
        const mapped = data.map((u) => ({
          id: u.university_id,
          name: u.name,
          image: u.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          location: [u.city, u.country].filter(Boolean).join(', ') || 'Cambodia',
          rating: u.ranking ? Math.max(1, 6 - u.ranking).toFixed(1) : '4.5',
          tuition: u.Majors?.length
            ? `$${Math.min(...u.Majors.map(m => Number(m.tuition_fee) || 0)).toLocaleString()}–${Math.max(...u.Majors.map(m => Number(m.tuition_fee) || 0)).toLocaleString()}/year`
            : 'Contact for details',
          topMajor: u.Majors?.[0]?.major_name || 'General Studies',
          type: 'Public University',
        }));
        setUniversities(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const sorted = [...universities].sort((a, b) => {
    if (sortBy === 'Name A-Z') return a.name.localeCompare(b.name);
    if (sortBy === 'Lowest Tuition') return a.tuition.localeCompare(b.tuition);
    return b.rating - a.rating;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paged = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

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
                <h1>Find Universities</h1>
                <p>
                  {loading
                    ? 'Loading...'
                    : `Showing ${sorted.length} universities found in Cambodia`}
                </p>
              </div>
              <div className="univ-header-right">
                <label>Sort By:</label>
                <div className="univ-sort-wrapper">
                  <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
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

              <div
                className={`univ-sidebar-overlay${mobileFilterOpen ? ' open' : ''}`}
                onClick={() => setMobileFilterOpen(false)}
              />

              <div className="univ-cards-area">
                {loading ? (
                  <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    Loading universities...
                  </div>
                ) : error ? (
                  <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
                    {error}
                  </div>
                ) : sorted.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    No universities found.
                  </div>
                ) : (
                  <>
                    <div className="univ-cards-grid">
                      {paged.map((uni) => (
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
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
