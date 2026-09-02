import React, { useState } from 'react';
import { Package } from 'lucide-react';

export function ImageWithFallback({ src, alt, className, ...props }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-[#F5F5F5] text-[#888888] ${className}`} {...props}>
        <Package className="w-1/3 h-1/3 opacity-30" strokeWidth={1} />
      </div>
    );
  }

  // Handle relative backend URLs (e.g., from local uploads)
  const getFullUrl = (url) => {
    if (url && url.startsWith('/uploads/')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      // If VITE_API_BASE_URL is 'http://localhost:8000/api', we just want the base domain
      const rootUrl = baseUrl.replace('/api', '');
      return `${rootUrl}${url}`;
    }
    return url;
  }

  return (
    <img
      src={getFullUrl(src)}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
