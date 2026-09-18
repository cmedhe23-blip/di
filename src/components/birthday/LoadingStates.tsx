import { useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * LoadableImage - Image component with loading state and skeleton
 */
export function LoadableImage({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {!loaded && !error && (
        <div className="img-loading absolute inset-0 rounded" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${className} ${loaded ? "img-loaded" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white/50 rounded">
          <div className="text-center">
            <Sparkles className="mx-auto mb-2 opacity-50" size={24} />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * VideoLoadingState - Loading indicator for video content
 */
export function VideoLoadingState() {
  return (
    <div className="video-loading">
      <div className="text-center">
        <Sparkles className="mx-auto mb-3 animate-spin-slow" size={32} />
        <p className="font-serif text-lg text-gold">Loading magical memories...</p>
      </div>
    </div>
  );
}

/**
 * Font loading handler - Call this on app mount
 */
export function handleFontLoading() {
  if (typeof document !== "undefined") {
    // Initially hide body to prevent FOUC
    document.body.classList.add("fonts-loading");

    // Check if fonts are loaded
    if (document.fonts) {
      document.fonts.ready
        .then(() => {
          document.body.classList.remove("fonts-loading");
          document.body.classList.add("fonts-loaded");
        })
        .catch(() => {
          // If font loading fails, show content anyway
          document.body.classList.remove("fonts-loading");
          document.body.classList.add("fonts-loaded");
        });
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => {
        document.body.classList.remove("fonts-loading");
        document.body.classList.add("fonts-loaded");
      }, 1000);
    }
  }
}
