/**
 * Feature Detection Utilities
 * 
 * Detects browser capabilities and provides fallbacks for:
 * - Canvas API (for particle effects and fireworks)
 * - Web Audio API (for sound effects)
 * - CSS backdrop-filter (for glassmorphism effects)
 * - requestAnimationFrame (for animations)
 */

export interface FeatureSupport {
  canvas: boolean;
  webAudio: boolean;
  backdropFilter: boolean;
  requestAnimationFrame: boolean;
  localStorage: boolean;
  mediaDevices: boolean;
  webGL: boolean;
}

/**
 * Check if Canvas API is supported
 */
export function detectCanvas(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch (e) {
    return false;
  }
}

/**
 * Check if WebGL is supported (for advanced canvas rendering)
 */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Check if Web Audio API is supported
 */
export function detectWebAudio(): boolean {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    return !!AudioContext;
  } catch (e) {
    return false;
  }
}

/**
 * Check if CSS backdrop-filter is supported
 */
export function detectBackdropFilter(): boolean {
  try {
    // Check if CSS.supports is available
    if (typeof CSS !== 'undefined' && CSS.supports) {
      return (
        CSS.supports('backdrop-filter', 'blur(1px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
      );
    }
    
    // Fallback: create test element
    const testElement = document.createElement('div');
    testElement.style.cssText = 'backdrop-filter: blur(1px); -webkit-backdrop-filter: blur(1px);';
    return (
      testElement.style.backdropFilter === 'blur(1px)' ||
      (testElement.style as any).webkitBackdropFilter === 'blur(1px)'
    );
  } catch (e) {
    return false;
  }
}

/**
 * Check if requestAnimationFrame is supported
 */
export function detectRequestAnimationFrame(): boolean {
  return !!(
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame
  );
}

/**
 * Check if localStorage is available and working
 */
export function detectLocalStorage(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if MediaDevices API is supported (for microphone)
 */
export function detectMediaDevices(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Detect all features at once
 */
export function detectAllFeatures(): FeatureSupport {
  return {
    canvas: detectCanvas(),
    webAudio: detectWebAudio(),
    backdropFilter: detectBackdropFilter(),
    requestAnimationFrame: detectRequestAnimationFrame(),
    localStorage: detectLocalStorage(),
    mediaDevices: detectMediaDevices(),
    webGL: detectWebGL(),
  };
}

/**
 * Get a polyfill for requestAnimationFrame if needed
 */
export function getRequestAnimationFrame(): (callback: FrameRequestCallback) => number {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    ((callback: FrameRequestCallback) => window.setTimeout(callback, 1000 / 60))
  );
}

/**
 * Get a polyfill for cancelAnimationFrame if needed
 */
export function getCancelAnimationFrame(): (handle: number) => void {
  return (
    window.cancelAnimationFrame ||
    (window as any).webkitCancelAnimationFrame ||
    (window as any).mozCancelAnimationFrame ||
    (window as any).msCancelAnimationFrame ||
    clearTimeout
  );
}

/**
 * Apply fallback styles when backdrop-filter is not supported
 */
export function applyBackdropFilterFallback() {
  if (!detectBackdropFilter()) {
    const style = document.createElement('style');
    style.textContent = `
      /* Fallback for browsers without backdrop-filter support */
      .glass-fallback,
      [class*="backdrop-blur"],
      .journey-top,
      .journey-nav,
      .scene-drawer,
      .modal-backdrop > *,
      .video-modal,
      .epistle-card,
      .scroll-letter,
      .memory-card {
        background-color: rgba(14, 7, 30, 0.92) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      
      /* Make glassmorphism elements more opaque */
      .btn-glass {
        background-color: rgba(255, 255, 255, 0.15) !important;
        border-color: rgba(255, 255, 255, 0.25) !important;
      }
      
      .btn-glass:hover {
        background-color: rgba(255, 255, 255, 0.22) !important;
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('no-backdrop-filter');
  }
}

/**
 * Log feature support information to console (for debugging)
 */
export function logFeatureSupport() {
  const features = detectAllFeatures();
  
  console.group('🎨 Browser Feature Support');
  console.log('Canvas API:', features.canvas ? '✅ Supported' : '❌ Not supported');
  console.log('WebGL:', features.webGL ? '✅ Supported' : '❌ Not supported');
  console.log('Web Audio API:', features.webAudio ? '✅ Supported' : '❌ Not supported');
  console.log('CSS backdrop-filter:', features.backdropFilter ? '✅ Supported' : '❌ Not supported');
  console.log('requestAnimationFrame:', features.requestAnimationFrame ? '✅ Supported' : '⚠️ Using polyfill');
  console.log('localStorage:', features.localStorage ? '✅ Supported' : '❌ Not supported');
  console.log('MediaDevices API:', features.mediaDevices ? '✅ Supported' : '❌ Not supported');
  console.groupEnd();
  
  // Show warning if critical features are missing
  if (!features.canvas) {
    console.warn('⚠️ Canvas not supported - particle effects will be disabled');
  }
  if (!features.webAudio) {
    console.warn('⚠️ Web Audio API not supported - sound effects will be limited');
  }
  if (!features.backdropFilter) {
    console.warn('⚠️ backdrop-filter not supported - using fallback opaque backgrounds');
  }
  
  return features;
}
