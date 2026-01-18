import axiosClient from './axiosClient';
import type { Enrollment, LessonProgress, ApiResponse, PaginatedResponse } from '../types/index';

const enrollmentService = {
  getEnrollments: (params = {}): Promise<ApiResponse<PaginatedResponse<Enrollment>>> => {
    return axiosClient.get('/enrollments/enrollments/', { params });
  },

  enrollInCourse: (courseId: number, data = {}): Promise<ApiResponse<Enrollment>> => {
    return axiosClient.post('/enrollments/enrollments/', {
      course: courseId,
      ...data,
    });
  },

  getEnrollmentByCourse: (courseId: number): Promise<ApiResponse<Enrollment>> => {
    return axiosClient.get(`/enrollments/enrollments/?course=${courseId}`);
  },

  updateProgress: (enrollmentId: number, data: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
    return axiosClient.patch(`/enrollments/enrollments/${enrollmentId}/`, data);
  },

  getLessonProgress: (enrollmentId: number, lessonId: number): Promise<ApiResponse<LessonProgress>> => {
    return axiosClient.get(`/enrollments/lesson-progress/?enrollment=${enrollmentId}&lesson=${lessonId}`);
  },

  completeLesson: (enrollmentId: number, lessonId: number, data = {}): Promise<ApiResponse<LessonProgress>> => {
    return axiosClient.post('/enrollments/lesson-progress/', {
      enrollment: enrollmentId,
      lesson: lessonId,
      completed: true,
      ...data,
    });
  },

  submitQuizAttempt: (data: any): Promise<ApiResponse<any>> => {
    return axiosClient.post('/enrollments/quiz-attempts/', data);
  },

  getQuizAttempts: (quizId: number): Promise<ApiResponse<any[]>> => {
    return axiosClient.get(`/enrollments/quiz-attempts/?quiz=${quizId}`);
  },
};

export default enrollmentService;