// services/searchCache.js
class SearchCache {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  isValid() {
    return this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheDuration);
  }

  set(data) {
    this.cache = data;
    this.cacheTime = Date.now();
  }

  get() {
    return this.isValid() ? this.cache : null;
  }

  clear() {
    this.cache = null;
    this.cacheTime = null;
  }
}

export const searchCache = new SearchCache();