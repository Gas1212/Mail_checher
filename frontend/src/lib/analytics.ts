// Analytics Configuration (GTM + GA4)

// Google Tag Manager
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5R55G5B8';

// Google Analytics 4
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-C55W805RM1';

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

// GA4 Event Tracker
export const trackGA4Event = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// GA4 Page View Tracker
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_ID, {
      page_path: url,
    });
  }
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// GTM Script
export const GTM_SCRIPT = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`;

// GA4 Script
export const GA4_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');
`;
