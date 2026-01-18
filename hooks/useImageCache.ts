import { useState, useEffect, useCallback } from 'react';
import { imageCache } from '@/lib/imageCache';

interface UseImageCacheOptions {
  ttl?: number;
  forceRefresh?: boolean;
  preload?: boolean;
}

export function useImageCache(url: string, options?: UseImageCacheOptions) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback(async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const imageData = await imageCache.loadImage(url, options);
      setData(imageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const refresh = useCallback(() => {
    loadImage();
  }, [loadImage]);

  const clearCache = useCallback(() => {
    imageCache.clear(url);
    setData(null);
    setError(null);
  }, [url]);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
  };
}

export function useImagePreloader() {
  const preloadImages = useCallback(async (urls: string[], options?: UseImageCacheOptions) => {
    try {
      await imageCache.preloadImages(urls, options);
    } catch (err) {
      console.error('Failed to preload images:', err);
    }
  }, []);

  const getCacheStats = useCallback(() => {
    return imageCache.getStats();
  }, []);

  const clearAllCache = useCallback(() => {
    imageCache.clear();
  }, []);

  return {
    preloadImages,
    getCacheStats,
    clearAllCache,
  };
}
