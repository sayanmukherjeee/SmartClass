// Core Types
// export interface TailwindClassNames {
//   // You can extend this interface as needed
// }
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  department?: string;
  profile_picture?: string;
  is_admin: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone: string;
  department: string;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  tokens: { access: string | null; refresh: string | null };
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; user?: User; error?: string }>;
  adminLogin: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>;
  adminRegister: (adminData: RegisterData) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  isAuthenticated: boolean;
}

// Course Types
export interface CourseCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  course_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  instructor: User;
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  video_preview?: string;
  duration_hours: number;
  language: string;
  subtitles: string[];
  is_cpd_accredited: boolean;
  cpd_points: number;
  accreditation_body: string;
  price: string;
  is_free: boolean;
  discount_price?: string;
  prerequisites: string;
  learning_objectives: string;
  target_audience: string;
  total_enrollments: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Module {
  id: number;
  course: number;
  title: string;
  description: string;
  order: number;
  duration_minutes: number;
}

export interface Lesson {
  id: number;
  module: number;
  title: string;
  lesson_type: 'video' | 'article' | 'quiz' | 'assignment' | 'live';
  content: string;
  video_url?: string;
  video_duration: number;
  attachments: string[];
  order: number;
  is_preview: boolean;
  must_complete: boolean;
  completion_threshold: number;
}

export interface Quiz {
  id: number;
  lesson: number;
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  time_limit?: number;
}

export interface Question {
  id: number;
  quiz: number;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  text: string;
  explanation: string;
  points: number;
  order: number;
}

export interface Choice {
  id: number;
  question: number;
  text: string;
  is_correct: boolean;
  order: number;
}

// Enrollment Types
export interface Enrollment {
  id: number;
  user: number;
  course: number;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  is_completed: boolean;
  last_accessed_at?: string;
}

export interface LessonProgress {
  id: number;
  enrollment: number;
  lesson: number;
  completed: boolean;
  completed_at?: string;
  score?: number;
  time_spent: number; // in seconds
}

// Organization Types
export interface Organization {
  id: number;
  name: string;
  domain: string;
  logo?: string;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  id: number;
  user: number;
  course?: number;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
}

// Certificate Types
export interface Certificate {
  id: number;
  user: number;
  course: number;
  certificate_code: string;
  issued_at: string;
  expires_at?: string;
  download_url: string;
  verification_url: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Pagination Info Type
export interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  total_pages: number;
}

// Filter Types
export interface CourseFilters {
  category?: string;
  level?: string;
  price?: 'free' | 'paid';
  min_rating?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// Course Context Type
export interface CourseContextType {
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