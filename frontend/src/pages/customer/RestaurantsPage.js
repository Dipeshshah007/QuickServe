import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantAPI } from '../../utils/api';
import RestaurantCard from '../../components/Customer/RestaurantCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import styles from './RestaurantsPage.module.css';

const CUISINES = ['All', 'Italian', 'American', 'Japanese', 'Indian', 'Mexican', 'Chinese', 'Thai'];

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [search, setSearch]           = useState(searchParams.get('search') || '');
  const [cuisine, setCuisine]         = useState(searchParams.get('cuisine') || '');
  const [page, setPage]               = useState(1);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search)  params.search  = search;
      if (cuisine && cuisine !== 'All') params.cuisine = cuisine;
      const res = await restaurantAPI.getAll(params);
      setRestaurants(res.data.restaurants);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, cuisine, page]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRestaurants();
  };

  const handleCuisine = (c) => {
    setCuisine(c === 'All' ? '' : c);
    setPage(1);
  };

  const clearFilters = () => { setSearch(''); setCuisine(''); setPage(1); };

  const hasFilters = search || cuisine;
  const totalPages = Math.ceil(total / 9);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="page-title">Restaurants</h1>
          <p className="text-muted">{total} restaurants available</p>
        </div>

        {/* Search + Filters */}
        <div className={styles.filtersWrap}>
          <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <FiSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className={styles.clearBtn}>
                <FiX size={16} />
              </button>
            )}
          </form>

          <div className={styles.cuisineFilters}>
            {CUISINES.map(c => (
              <button
                key={c}
                className={`${styles.cuisineBtn} ${(cuisine === c || (!cuisine && c === 'All')) ? styles.active : ''}`}
                onClick={() => handleCuisine(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button className={styles.clearAll} onClick={clearFilters}>
              <FiX size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <span className="icon">🍽️</span>
            <h3>No restaurants found</h3>
            <p>Try adjusting your search or filters</p>
            {hasFilters && (
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
