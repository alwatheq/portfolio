import { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

export const PageTracker = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track initial page load
    trackPageView('portfolio_home');

    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(maxScroll)) {
          trackPageView(`scroll_${maxScroll}%`);
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth);
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, [trackPageView]);

  return null; // This component doesn't render anything
};