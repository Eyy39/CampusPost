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
  const [filters, setFilters] = useState({ name: '', tuition: 15000, major: '', minRating: 0 });
  const [favorites, setFavorites] = useState({});
  const perPage = 6;

  useEffect(() => {
    api.get('/universities')
      .then((data) => {
        const mapped = data.map((u) => {
          const fees = u.Majors?.map(m => Number(m.tuition_fee) || 0) || [];
          const tuitionMin = fees.length ? Math.min(...fees) : 0;
          const tuitionMax = fees.length ? Math.max(...fees) : 0;
          const majorNames = u.Majors?.map(m => m.major_name.toLowerCase()) || [];
          return {
            id: u.university_id,
            name: u.name,
            image: u.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            location: [u.city, u.country].filter(Boolean).join(', ') || 'Cambodia',
            rating: u.ranking ? Math.max(1, 6 - u.ranking).toFixed(1) : '4.5',
            tuition: fees.length
              ? (tuitionMin === tuitionMax ? `$${tuitionMin.toLocaleString()}/year` : `$${tuitionMin.toLocaleString()}–${tuitionMax.toLocaleString()}/year`)
              : 'Contact for details',
            tuitionMin,
            tuitionMax,
            majorNames,
            topMajor: u.Majors?.[0]?.major_name || 'General Studies',
            type: 'Public University',
          };
        });
        setUniversities(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    const token = localStorage.getItem('campuspost_token');
    if (token) {
      api.get('/favorites').then((data) => {
        const favMap = {};
        data.forEach(f => { favMap[f.university_id] = f.favorite_id; });
        setFavorites(favMap);
      }).catch(() => {});
    }
  }, []);

  const toggleFavorite = async (universityId) => {
    const token = localStorage.getItem('campuspost_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const existingFavId = favorites[universityId];
    if (existingFavId) {
      try {
        await api.delete(`/favorites/${existingFavId}`);
        setFavorites(prev => {
          const next = { ...prev };
          delete next[universityId];
          return next;
        });
      } catch (err) {
        alert('Failed to remove favorite. Please try again.');
      }
    } else {
      try {
        const result = await api.post('/favorites', { university_id: universityId });
        setFavorites(prev => ({ ...prev, [universityId]: result.favorite_id }));
      } catch (err) {
        alert('Failed to save favorite. Please try again.');
      }
    }
  };

  const filtered = universities.filter((u) => {
    if (filters.name.trim() && !u.name.toLowerCase().includes(filters.name.trim().toLowerCase())) return false;
    if (u.tuitionMin > filters.tuition) return false;
    if (filters.major && !u.majorNames.some(m => m.includes(filters.major.toLowerCase()))) return false;
    if (filters.minRating > 0 && parseFloat(u.rating) < filters.minRating) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
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
                    : `Showing ${sorted.length} universities found`}
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
                <FilterSidebar onApply={(f) => { setFilters(f); setCurrentPage(1); }} />
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
                        <UniversityCard
                          key={uni.id}
                          university={uni}
                          isFavorite={!!favorites[uni.id]}
                          onToggleFavorite={toggleFavorite}
                        />
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
