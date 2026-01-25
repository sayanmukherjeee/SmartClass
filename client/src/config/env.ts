// Environment configuration
export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://smartclass-backend-bxld.onrender.com/api/v1/' 
      : 'http://localhost:8000/api/v1/'),
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'SmartClass',
  
  // Environment Detection
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_VERCEL: import.meta.env.VERCEL === '1',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.PROD, // Only in production
  ENABLE_LOGGING: !import.meta.env.PROD, // Only in development
} as const;

// Helper function to log only in development
export const devLog = (...args: any[]) => {
  if (env.IS_DEVELOPMENT) {
    console.log('[DEV]', ...args);
  }
};

// Helper function to log only in production
export const prodLog = (...args: any[]) => {
  if (env.IS_PRODUCTION) {
    console.log('[PROD]', ...args);
  }
};