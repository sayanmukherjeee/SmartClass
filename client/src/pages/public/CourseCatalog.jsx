import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CourseCard from '../../components/courses/CourseCard';
import CourseFilters from '../../components/courses/CourseFilters';
import { useCourse } from '../../contexts/CourseContext';
import './CourseCatalog.css';

const CourseCatalog = () => {
  const { courses, categories, loading, error, fetchCourses, searchCourses } = useCourse();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    rating: searchParams.get('rating') || '',
  });

  useEffect(() => {
    // Load courses with current filters
    const loadCourses = async () => {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.price) params.price = filters.price;
      if (filters.rating) params.min_rating = filters.rating;
      
      await fetchCourses(params);
    };
    
    loadCourses();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCourses(searchQuery, filters);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Update URL params
    const params = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      level: '',
      price: '',
      rating: '',
    });
    setSearchQuery('');
    setSearchParams({});
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
        <button onClick={() => fetchCourses()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="course-catalog">
      <div className="catalog-header">
        <div className="header-content">
          <h1>Explore Our Courses</h1>
          <p>Browse through {courses.length} courses across various categories</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search courses by title, instructor, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="catalog-container">
        <div className="sidebar">
          <CourseFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="main-content">
          <div className="courses-header">
            <h2>All Courses ({courses.length})</h2>
            <div className="sort-options">
              <select className="form-select">
                <option>Sort by: Recommended</option>
                <option>Most Popular</option>
                <option>Highest Rated</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-book-open"></i>
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search query</p>
              <button onClick={handleClearFilters} className="btn btn-outline">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {courses.length > 0 && (
            <div className="pagination">
              <button className="btn btn-outline" disabled>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <div className="page-numbers">
                <span className="active">1</span>
                <span>2</span>
                <span>3</span>
                <span>...</span>
                <span>10</span>
              </div>
              <button className="btn btn-outline">
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;