// Application Configuration

// App domain for dashboard and authentication
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://app.sugesto.xyz';

// Main website domain
export const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://sugesto.xyz';

// Helper function to get full URL for app routes
export const getAppUrl = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${APP_DOMAIN}/${cleanPath}`;
};

// Helper function to get full URL for main site routes
export const getMainUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${MAIN_DOMAIN}/${cleanPath}`;
};
