import mixpanel from 'mixpanel-browser';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;

let mixpanelInited = false;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer!.push(arguments);
    }
    window.gtag = gtag;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => {
      window.gtag?.('js', new Date());
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
      });
    };
    document.head.appendChild(script);
  }

  if (MIXPANEL_TOKEN && !mixpanelInited) {
    mixpanel.init(MIXPANEL_TOKEN, {
      track_pageview: false,
      persistence: 'localStorage',
    });
    mixpanelInited = true;
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }

  if (MIXPANEL_TOKEN && mixpanelInited) {
    mixpanel.track('page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', action, {
      ...params,
    });
  }

  if (MIXPANEL_TOKEN && mixpanelInited) {
    mixpanel.track(action, params ?? {});
  }
}