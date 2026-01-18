interface CacheEntry {
  data: string;
  timestamp: number;
  etag?: string;
  lastModified?: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  forceRefresh?: boolean;
  etag?: string;
  lastModified?: string;
}

class ImageCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

  constructor() {
    // Start cleanup interval
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Generate cache key from URL and optional parameters
   */
  private getKey(url: string, options?: CacheOptions): string {
    const suffix = options?.forceRefresh ? '_force' : '';
    return `${url}${suffix}`;
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry, ttl: number): boolean {
    return Date.now() - entry.timestamp > ttl;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > this.DEFAULT_TTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cached image data
   */
  async get(url: string, options?: CacheOptions): Promise<string | null> {
    const key = this.getKey(url, options);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const ttl = options?.ttl || this.DEFAULT_TTL;
    if (this.isExpired(entry, ttl)) {
      this.cache.delete(key);
      return null;
    }

    console.log('[ImageCache] Cache hit:', url);
    return entry.data;
  }

  /**
   * Set image data in cache
   */
  async set(url: string, data: string, options?: CacheOptions): Promise<void> {
    const key = this.getKey(url, options);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      etag: options?.etag,
      lastModified: options?.lastModified,
    };

    this.cache.set(key, entry);
    console.log('[ImageCache] Cache set:', url);
  }

  /**
   * Check if image has changed using headers
   */
  private hasImageChanged(response: Response, cachedEntry?: CacheEntry): boolean {
    if (!cachedEntry) return true;

    const etag = response.headers.get('etag');
    const lastModified = response.headers.get('last-modified');

    if (etag && cachedEntry.etag && etag !== cachedEntry.etag) {
      return true;
    }

    if (lastModified && cachedEntry.lastModified && lastModified !== cachedEntry.lastModified) {
      return true;
    }

    return false;
  }

  /**
   * Load image with caching
   */
  async loadImage(url: string, options?: CacheOptions): Promise<string> {
    // Check cache first
    if (!options?.forceRefresh) {
      const cached = await this.get(url, options);
      if (cached) {
        return cached;
      }
    }

    try {
      console.log('[ImageCache] Fetching:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status}`);
      }

      const cachedEntry = this.cache.get(this.getKey(url, options));
      
      // Check if image has changed
      if (!this.hasImageChanged(response, cachedEntry)) {
        console.log('[ImageCache] Image unchanged:', url);
        return cachedEntry?.data || '';
      }

      const data = await response.text();
      
      // Cache the new data
      await this.set(url, data, {
        ...options,
        etag: response.headers.get('etag') || undefined,
        lastModified: response.headers.get('last-modified') || undefined,
      });

      return data;
    } catch (error) {
      console.error('[ImageCache] Error loading image:', url, error);
      
      // Try to return stale cache if available
      const staleCache = await this.get(url, { ...options, ttl: Date.now() }); // Force return
      if (staleCache) {
        console.log('[ImageCache] Using stale cache for:', url);
        return staleCache;
      }
      
      throw error;
    }
  }

  /**
   * Preload multiple images
   */
  async preloadImages(urls: string[], options?: CacheOptions): Promise<void> {
    const promises = urls.map(url => 
      this.loadImage(url, options).catch(error => 
        console.error('[ImageCache] Failed to preload:', url, error)
      )
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * Clear cache or specific entry
   */
  clear(url?: string): void {
    if (url) {
      this.cache.delete(url);
      console.log('[ImageCache] Cleared cache for:', url);
    } else {
      this.cache.clear();
      console.log('[ImageCache] Cleared all cache');
    }
  }

  // Get cache statistics
  getStats(): { size: number; entries: Array<{ key: string; age: number }> } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }
}

// Export singleton instance
export const imageCache = new ImageCache();
export default imageCache;
