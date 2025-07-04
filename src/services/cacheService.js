// services/cacheService.js
class CacheService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  generateKey(params) {
    return JSON.stringify(params);
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    const expiry = this.cacheExpiry.get(key);
    if (Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService();