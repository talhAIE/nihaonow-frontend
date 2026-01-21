import React from 'react';
import { useImageCache } from '@/hooks/useImageCache';

interface CachedImageProps {
  url: string;
  alt?: string;
  className?: string;
  ttl?: number;
  forceRefresh?: boolean;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export function CachedImage({
  url,
  alt = '',
  className = '',
  ttl,
  forceRefresh,
  fallback,
  onLoad,
  onError,
}: CachedImageProps) {
  const { data, loading, error, refresh } = useImageCache(url, { ttl, forceRefresh });

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    onError?.();
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 ${className}`} style={{ minHeight: '100px' }}>
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 ${className}`} style={{ minHeight: '100px' }}>
        <div className="text-red-500 text-sm p-2">Failed to load image</div>
        {fallback && <div onClick={refresh}>{fallback}</div>}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`bg-gray-100 ${className}`} style={{ minHeight: '100px' }}>
        <div className="text-gray-500 text-sm">No image data</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={`data:image/svg+xml;base64,${data}`}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default CachedImage;
