// Google Tag Manager Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5R55G5B8';

// GTM Events
export const GTMEvents = {
  // Page Events
  PAGE_VIEW: 'page_view',

  // Email Validation Events
  EMAIL_CHECK: 'email_check',
  BULK_CHECK: 'bulk_check',
  MX_LOOKUP: 'mx_lookup',

  // SEO Tools Events
  SITEMAP_VALIDATE: 'sitemap_validate',
  SITEMAP_FIND: 'sitemap_find',

  // Security Events
  SPF_GENERATE: 'spf_generate',
  BLACKLIST_CHECK: 'blacklist_check',

  // User Events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
};

// GTM Event Tracker
export const trackEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}
