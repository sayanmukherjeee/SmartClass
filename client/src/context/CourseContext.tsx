import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import courseService from '../api/courses';
import type { Course, CourseCategory, CourseFilters, PaginatedResponse, PaginationInfo } from '../types/index';

interface CourseContextType {
  courses: Course[];
  coursesPagination?: PaginationInfo;
  featuredCourses: Course[];
  popularCourses: Course[];
  categories: CourseCategory[];
  categoryPagination?: PaginationInfo;
  loading: boolean;
  error: string | null;
  fetchCourses: (params?: CourseFilters) => Promise<void>;
  getCourseById: (courseId: number) => Promise<Course>;
  searchCourses: (query: string, filters?: CourseFilters) => Promise<void>;
  refreshCategories: (page?: number) => Promise<void>;
  loadMoreCategories: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | null>(null);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesPagination, setCoursesPagination] = useState<PaginationInfo | undefined>();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoryPagination, setCategoryPagination] = useState<PaginationInfo | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async (params: CourseFilters = {}) => {
    setLoading(true);
    try {
      const response = await courseService.getCourses(params);
      const data = response.data as PaginatedResponse<Course>;
      setCourses(data.results || []);
      setCoursesPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page: params.page || 1,
        total_pages: Math.ceil(data.count / (params.page_size || 12))
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCourses = async () => {
    try {
      const response = await courseService.getFeaturedCourses();
      setFeaturedCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch featured courses:', err);
      setFeaturedCourses([]);
    }
  };

  const fetchPopularCourses = async () => {
    try {
      const response = await courseService.getPopularCourses();
      setPopularCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch popular courses:', err);
      setPopularCourses([]);
    }
  };

  const fetchCategories = async (page: number = 1, pageSize: number = 100) => {
    try {
      const response = await courseService.getCategories({ page, page_size: pageSize });
      const data = response.data as PaginatedResponse<CourseCategory>;
      
      if (page === 1) {
        setCategories(data.results || []);
      } else {
        setCategories(prev => [...prev, ...(data.results || [])]);
      }
      
      setCategoryPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page: page,
        total_pages: Math.ceil(data.count / pageSize)
      });
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

  const loadMoreCategories = async () => {
    if (categoryPagination?.next && !loading) {
      const nextPage = (categoryPagination.page || 1) + 1;
      await fetchCategories(nextPage);
    }
  };

  const refreshCategories = async (page: number = 1) => {
    await fetchCategories(page);
  };

  const getCourseById = async (courseId: number): Promise<Course> => {
    try {
      const response = await courseService.getCourse(courseId);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch course');
      throw err;
    }
  };

  const searchCourses = async (query: string, filters: CourseFilters = {}) => {
    setLoading(true);
    try {
      const response = await courseService.searchCourses(query, filters);
      const data = response.data as PaginatedResponse<Course>;
      setCourses(data.results || []);
      setCoursesPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page: filters.page || 1,
        total_pages: Math.ceil(data.count / (filters.page_size || 12))
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Search failed');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCourses();
    fetchPopularCourses();
    fetchCategories();
  }, []);

  const value: CourseContextType = {
    courses,
    coursesPagination,
    featuredCourses,
    popularCourses,
    categories,
    categoryPagination,
    loading,
    error,
    fetchCourses,
    getCourseById,
    searchCourses,
    refreshCategories,
    loadMoreCategories,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};