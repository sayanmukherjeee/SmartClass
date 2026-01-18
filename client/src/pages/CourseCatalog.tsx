import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import type { CourseFilters } from '../types/index';

const CourseCatalog: React.FC = () => {
  const { 
    courses, 
    coursesPagination,
    categories, 
    categoryPagination,
    loading, 
    error, 
    fetchCourses, 
    searchCourses,
    loadMoreCategories 
  } = useCourse();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  const [filters, setFilters] = useState<CourseFilters>({
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') as 'free' | 'paid' || undefined,
    min_rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
    search: searchParams.get('search') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    page_size: searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : 12
  });

  const navigate = useNavigate();

  // Fetch courses when filters change
  useEffect(() => {
    const loadCourses = async () => {
      await fetchCourses(filters);
    };
    
    loadCourses();
  }, [filters]);

  // Update active filters set
  useEffect(() => {
    const newActiveFilters = new Set<string>();
    if (filters.category) newActiveFilters.add(`category:${filters.category}`);
    if (filters.level) newActiveFilters.add(`level:${filters.level}`);
    if (filters.price) newActiveFilters.add(`price:${filters.price}`);
    if (filters.min_rating) newActiveFilters.add(`rating:${filters.min_rating}+`);
    if (filters.search) newActiveFilters.add(`search:"${filters.search}"`);
    setActiveFilters(newActiveFilters);
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters(prev => ({
        ...prev,
        search: searchQuery.trim(),
        page: 1
      }));
      setSearchParams({
        ...Object.fromEntries(searchParams),
        search: searchQuery.trim()
      });
    }
  };

  const handleFilterChange = (newFilters: Partial<CourseFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL params
    const params: Record<string, string> = {};
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params[key] = String(value);
      }
    });
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      level: '',
      price: undefined,
      min_rating: undefined,
      search: '',
      ordering: '-created_at',
      page: 1,
      page_size: 12
    });
    setSearchQuery('');
    setActiveFilters(new Set());
    setSearchParams({});
  };

  const handleRemoveFilter = (filterKey: string) => {
    const [type, value] = filterKey.split(':');
    switch (type) {
      case 'category':
        handleFilterChange({ category: '' });
        break;
      case 'level':
        handleFilterChange({ level: '' });
        break;
      case 'price':
        handleFilterChange({ price: undefined });
        break;
      case 'rating':
        handleFilterChange({ min_rating: undefined });
        break;
      case 'search':
        handleFilterChange({ search: '' });
        setSearchQuery('');
        break;
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange({ ordering: e.target.value });
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle loading more categories
  const handleLoadMoreCategories = async () => {
    setCategoriesLoading(true);
    try {
      await loadMoreCategories();
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Calculate visible categories
  const visibleCategories = showAllCategories 
    ? safeCategories 
    : safeCategories.slice(0, 6);

  // Get total pages for pagination
  const totalPages = coursesPagination ? Math.ceil(coursesPagination.count / (filters.page_size || 12)) : 1;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const current = filters.page || 1;
    const pages = [];
    
    // Always show first page
    if (current > 3) {
      pages.push(1);
      if (current > 4) pages.push('ellipsis');
    }
    
    // Show pages around current
    for (let i = Math.max(1, current - 2); i <= Math.min(totalPages, current + 2); i++) {
      pages.push(i);
    }
    
    // Always show last page if needed
    if (current < totalPages - 2) {
      if (current < totalPages - 3) pages.push('ellipsis');
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (error && error.includes('categories')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load categories</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <button 
            onClick={() => fetchCourses()} 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Your Next Course
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Browse through our extensive library of professional development courses
            </p>
            
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xl">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses by title, instructor, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm rounded-2xl border-0 focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent"
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.size > 0 && (
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Active filters:</span>
                {Array.from(activeFilters).map(filter => {
                  const [type, value] = filter.split(':');
                  const displayValue = value.replace('"', '').replace('"', '');
                  return (
                    <button
                      key={filter}
                      onClick={() => handleRemoveFilter(filter)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      {displayValue}
                      <span className="text-indigo-500">×</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="mr-2">⚙️</span> Filters
                </h3>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Category</h4>
                  {categoryPagination && categoryPagination.count > 6 && (
                    <button 
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      onClick={() => setShowAllCategories(!showAllCategories)}
                    >
                      {showAllCategories ? 'Show Less' : `Show All (${categoryPagination.count})`}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${!filters.category ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange({ category: '' })}
                  >
                    All Categories
                  </button>
                  
                  {/* Render visible categories */}
                  {visibleCategories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${filters.category === category.name ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleFilterChange({ category: category.name })}
                    >
                      <span className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color || '#667eea' }}
                        />
                        {category.name}
                      </span>
                    </button>
                  ))}
                  
                  {/* Show "View More" button if we have more categories */}
                  {!showAllCategories && safeCategories.length > 6 && (
                    <button 
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowAllCategories(true)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">📚</span> View More Categories
                      </span>
                    </button>
                  )}
                </div>
                
                {/* Load more button for paginated categories */}
                {showAllCategories && categoryPagination?.next && (
                  <div className="mt-4">
                    <button 
                      className="w-full px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                      onClick={handleLoadMoreCategories}
                      disabled={categoriesLoading}
                    >
                      {categoriesLoading ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></span>
                          Loading...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">⬇️</span>
                          Load More Categories
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Level Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Level</h4>
                <div className="space-y-2">
                  {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <button
                      key={level}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${filters.level === level.toLowerCase() || (!filters.level && level === 'All Levels') ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleFilterChange({ 
                        level: level === 'All Levels' ? '' : level.toLowerCase() 
                      })}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Price</h4>
                <div className="space-y-2">
                  {['All Prices', 'Free', 'Paid'].map(price => (
                    <button
                      key={price}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${(filters.price === price.toLowerCase() || (!filters.price && price === 'All Prices')) ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleFilterChange({ 
                        price: price === 'All Prices' ? undefined : price.toLowerCase() as 'free' | 'paid'
                      })}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Rating</h4>
                <div className="space-y-2">
                  {['All Ratings', '4.5+', '4.0+', '3.5+', '3.0+'].map(rating => {
                    const ratingValue = rating === 'All Ratings' ? undefined : parseFloat(rating);
                    return (
                      <button
                        key={rating}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${filters.min_rating === ratingValue || (!filters.min_rating && rating === 'All Ratings') ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleFilterChange({ 
                          min_rating: ratingValue 
                        })}
                      >
                        {rating}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📊</span> Catalog Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {categoryPagination?.count || safeCategories.length}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {coursesPagination?.count || courses.length}+
                  </div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">5,000+</div>
                  <div className="text-sm text-gray-600">Hours Content</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">All Courses</h2>
                  <p className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{courses.length}</span> of <span className="font-semibold text-gray-900">{coursesPagination?.count || 0}</span> courses
                    {filters.search && (
                      <span> for "<span className="font-semibold text-gray-900">{filters.search}</span>"</span>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <select 
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filters.ordering || '-created_at'}
                    onChange={handleSortChange}
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="-average_rating">Highest Rated</option>
                    <option value="-total_enrollments">Most Popular</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="title">Title A-Z</option>
                    <option value="-title">Title Z-A</option>
                  </select>
                  
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      title="Grid View"
                    >
                      <span className="text-xl">◼◼</span>
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      title="List View"
                    >
                      <span className="text-xl">☰</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading && courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No courses found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters or search query</p>
                <button 
                  onClick={handleClearFilters} 
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-6">
                    <button 
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${filters.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page! - 1)}
                    >
                      <span className="flex items-center">
                        <span className="mr-2">←</span> Previous
                      </span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {getPageNumbers().map((page, index) => {
                        if (page === 'ellipsis') {
                          return (
                            <span key={`ellipsis-${index}`} className="px-4 py-2">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-all ${filters.page === page ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'hover:bg-gray-100'}`}
                            onClick={() => handlePageChange(page as number)}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${filters.page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      disabled={filters.page === totalPages}
                      onClick={() => handlePageChange(filters.page! + 1)}
                    >
                      <span className="flex items-center">
                        Next
                        <span className="ml-2">→</span>
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Categories Banner */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Browse by <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Category</span>
            </h3>
            <p className="text-xl text-gray-600">Find courses in your area of interest</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {safeCategories.slice(0, 6).map(category => (
              <div 
                key={category.id} 
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-transparent transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/courses?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}
                    style={{ 
                      backgroundColor: `${category.color || '#667eea'}20`,
                      color: category.color || '#667eea'
                    }}
                  >
                    <span className="text-2xl">📚</span>
                  </div>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                    {category.course_count || Math.floor(Math.random() * 50) + 1} courses
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h4>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {category.description || 'Explore courses in this category'}
                </p>
                
                <span className="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
                  Explore category
                  <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            ))}
          </div>
          
          {/* Show all categories link */}
          {safeCategories.length > 6 && (
            <div className="text-center">
              <button 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
                onClick={() => setShowAllCategories(true)}
              >
                <span className="mr-3">📚</span> View All Categories
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;