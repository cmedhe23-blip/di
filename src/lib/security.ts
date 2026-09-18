/**
 * Security utilities for URL validation and sanitization
 * Prevents XSS and ensures safe external content loading
 */

/**
 * Validate if a URL is safe to use
 * Checks for valid protocols and blocks dangerous schemes
 */
export function isValidURL(urlString: string): boolean {
  if (!urlString || typeof urlString !== "string") return false;

  try {
    const url = new URL(urlString);
    
    // Only allow http, https, and data URLs
    const allowedProtocols = ["http:", "https:", "data:"];
    if (!allowedProtocols.includes(url.protocol)) {
      console.warn(`Blocked unsafe protocol: ${url.protocol}`);
      return false;
    }

    // Block javascript: protocol explicitly
    if (urlString.toLowerCase().includes("javascript:")) {
      console.warn("Blocked javascript: protocol");
      return false;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Validate video URL (supports direct files and common video platforms)
 */
export function isValidVideoURL(urlString: string | null): boolean {
  if (!urlString) return false;

  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

  // Allow relative paths like /d.mp4 served from the public folder
  if (urlString.startsWith("/") && !urlString.startsWith("//")) {
    if (videoExtensions.some(ext => urlString.toLowerCase().endsWith(ext))) {
      return true;
    }
  }

  if (!isValidURL(urlString)) return false;

  try {
    // Try as absolute URL; fall back to using current origin as base
    let url: URL;
    try {
      url = new URL(urlString);
    } catch {
      url = new URL(urlString, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    }

    // Allow direct video files
    if (videoExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
      return true;
    }

    // Allow common video platforms
    const allowedDomains = [
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "dailymotion.com",
      "player.vimeo.com",
      "youtube-nocookie.com",
    ];

    const hostname = url.hostname.toLowerCase();
    if (allowedDomains.some(domain => hostname.includes(domain))) {
      return true;
    }

    // Allow localhost and local network for development
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.")
    ) {
      return true;
    }

    console.warn(`Video URL from untrusted domain: ${hostname}`);
    return false;
  } catch {
    return false;
  }
}

/**
 * Validate audio/music URL
 */
export function isValidMusicURL(urlString: string | null): boolean {
  if (!urlString) return false;

  const audioExtensions = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];

  // Allow relative paths like /music.mp3 served from the public folder
  if (urlString.startsWith("/") && !urlString.startsWith("//")) {
    if (audioExtensions.some(ext => urlString.toLowerCase().endsWith(ext))) {
      return true;
    }
  }

  if (!isValidURL(urlString)) return false;

  try {
    let url: URL;
    try {
      url = new URL(urlString);
    } catch {
      url = new URL(urlString, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    }

    if (audioExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
      return true;
    }

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.")
    ) {
      return true;
    }

    if (url.protocol === "https:") {
      return true;
    }

    console.warn(`Music URL may be unsafe: ${urlString}`);
    return false;
  } catch {
    return false;
  }
}

/**
 * Sanitize URL for display purposes
 * Removes sensitive information and truncates long URLs
 */
export function sanitizeURLForDisplay(urlString: string, maxLength = 50): string {
  try {
    const url = new URL(urlString);
    let display = `${url.hostname}${url.pathname}`;
    
    if (display.length > maxLength) {
      display = display.substring(0, maxLength - 3) + "...";
    }
    
    return display;
  } catch {
    return urlString.substring(0, maxLength);
  }
}

/**
 * Content Security Policy recommendation
 * Returns a CSP string for use in meta tags or headers
 */
export function getRecommendedCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for React dev and Vite
    "style-src 'self' 'unsafe-inline'", // Required for styled components
    "img-src 'self' data: https:",
    "media-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src https://www.youtube.com https://player.vimeo.com",
  ].join("; ");
}

/**
 * Validate and sanitize user input for customizations
 */
export function sanitizeTextInput(input: string, maxLength = 500): string {
  if (!input || typeof input !== "string") return "";
  
  // Trim and limit length
  let sanitized = input.trim().substring(0, maxLength);
  
  // Remove potentially dangerous characters
  // Keep letters, numbers, spaces, and common punctuation
  sanitized = sanitized.replace(/[<>{}]/g, "");
  
  return sanitized;
}

/**
 * Check if content is being served over HTTPS
 */
export function isSecureContext(): boolean {
  if (typeof window === "undefined") return true;
  
  return (
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}
