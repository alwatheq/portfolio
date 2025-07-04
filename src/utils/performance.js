export const measurePerformance = () => {
  // Core Web Vitals
  if ('web-vital' in window) {
    import('web-vitals').then(({ getLCP, getFID, getCLS, getFCP, getTTFB }) => {
      getLCP(console.log);
      getFID(console.log);
      getCLS(console.log);
      getFCP(console.log);
      getTTFB(console.log);
    });
  }

  // Custom metrics
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'navigation') {
        console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
      }
    });
  });

  observer.observe({ entryTypes: ['navigation'] });
};