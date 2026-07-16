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

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
