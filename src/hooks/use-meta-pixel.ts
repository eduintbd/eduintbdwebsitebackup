// Meta Pixel tracking hook
declare global {
  interface Window {
    fbq: (action: string, eventName: string, params?: Record<string, any>) => void;
  }
}

export const useMetaPixel = () => {
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, params);
      console.log('Meta Pixel event tracked:', eventName, params);
    }
  };

  const trackPageView = () => {
    trackEvent('PageView');
  };

  const trackLead = (params?: Record<string, any>) => {
    trackEvent('Lead', params);
  };

  const trackCompleteRegistration = (params?: Record<string, any>) => {
    trackEvent('CompleteRegistration', params);
  };

  const trackSchedule = (params?: Record<string, any>) => {
    trackEvent('Schedule', params);
  };

  const trackContact = (params?: Record<string, any>) => {
    trackEvent('Contact', params);
  };

  return {
    trackEvent,
    trackPageView,
    trackLead,
    trackCompleteRegistration,
    trackSchedule,
    trackContact,
  };
};
