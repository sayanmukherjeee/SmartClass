import axiosClient from './axiosClient';
import type { 
  Course, Module, Lesson, CourseCategory, 
  PaginatedResponse, ApiResponse, CourseFilters 
} from '../types/index';

const courseService = {
  // Get courses with pagination
  getCourses: (params: CourseFilters = {}): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    return axiosClient.get('/courses/courses/', { params });
  },

  getCourse: (courseId: number): Promise<ApiResponse<Course>> => {
    return axiosClient.get(`/courses/courses/${courseId}/`);
  },

  getCourseBySlug: (slug: string): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    return axiosClient.get(`/courses/courses/?slug=${slug}`);
  },

  // Get featured courses (non-paginated)
  getFeaturedCourses: (): Promise<ApiResponse<Course[]>> => {
    return axiosClient.get('/courses/featured/');
  },

  // Get popular courses (non-paginated)
  getPopularCourses: (): Promise<ApiResponse<Course[]>> => {
    return axiosClient.get('/courses/popular/');
  },

  getRecommendedCourses: (): Promise<ApiResponse<Course[]>> => {
    return axiosClient.get('/courses/recommended/');
  },

  // Search courses with pagination
  searchCourses: (query: string, filters: CourseFilters = {}): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    const params = { search: query, ...filters };
    return axiosClient.get('/courses/search/', { params });
  },

  // Get categories with pagination support
  getCategories: (params?: { page?: number; page_size?: number }): Promise<ApiResponse<PaginatedResponse<CourseCategory>>> => {
    return axiosClient.get('/courses/categories/', { params });
  },

  getCourseModules: (courseId: number): Promise<ApiResponse<Module[]>> => {
    return axiosClient.get(`/courses/modules/?course=${courseId}`);
  },

  getModuleLessons: (moduleId: number): Promise<ApiResponse<Lesson[]>> => {
    return axiosClient.get(`/courses/lessons/?module=${moduleId}`);
  },

  createCourse: (courseData: Partial<Course>): Promise<ApiResponse<Course>> => {
    return axiosClient.post('/courses/courses/', courseData);
  },

  updateCourse: (courseId: number, courseData: Partial<Course>): Promise<ApiResponse<Course>> => {
    return axiosClient.put(`/courses/courses/${courseId}/`, courseData);
  },

  deleteCourse: (courseId: number): Promise<ApiResponse<void>> => {
    return axiosClient.delete(`/courses/courses/${courseId}/`);
  },

  uploadThumbnail: (courseId: number, file: File): Promise<ApiResponse<Course>> => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return axiosClient.patch(`/courses/courses/${courseId}/upload_thumbnail/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default courseService;