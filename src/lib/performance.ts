/**
 * Performance utilities for detecting device capabilities
 * and adjusting visual effects accordingly
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  supportsWebGL: boolean;
  devicePixelRatio: number;
}

/**
 * Detect if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

/**
 * Detect if device is low-end based on multiple factors
 */
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  if (cores <= 2) return true;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory <= 2) return true;

  // Check connection speed
  const connection = (navigator as any).connection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === "slow-2g" || effectiveType === "2g") return true;
    if (connection.saveData) return true;
  }

  return false;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check WebGL support
 */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Get comprehensive device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  return {
    isMobile: isMobileDevice(),
    isLowEnd: isLowEndDevice(),
    prefersReducedMotion: prefersReducedMotion(),
    supportsWebGL: supportsWebGL(),
    devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
  };
}

/**
 * Get recommended particle count based on device
 */
export function getRecommendedParticleCount(baseCount: number): number {
  const caps = getDeviceCapabilities();
  
  if (caps.prefersReducedMotion) return 0;
  if (caps.isLowEnd) return Math.floor(baseCount * 0.3);
  if (caps.isMobile) return Math.floor(baseCount * 0.5);
  
  return baseCount;
}

/**
 * Get animation frame rate based on device
 */
export function getAnimationFrameRate(): number {
  const caps = getDeviceCapabilities();
  
  if (caps.isLowEnd) return 30;
  if (caps.isMobile) return 45;
  
  return 60;
}

/**
 * Throttle function calls to improve performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function(...args: Parameters<T>) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  };
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(callback: () => void, timeout = 2000): number {
  if (typeof window === "undefined") return 0;
  
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  
  // Fallback to setTimeout
  return window.setTimeout(callback, 1) as unknown as number;
}
