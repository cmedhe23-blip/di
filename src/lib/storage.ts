/**
 * Persistent storage utilities for user preferences and progress
 * Safely handles localStorage with fallbacks and validation
 */

const STORAGE_KEY = "cosmic-birthday-journey";
const STORAGE_VERSION = "1.0";

export interface JourneyState {
  version: string;
  lastScene: number;
  musicEnabled: boolean;
  customizations: {
    sisterName?: string;
    finalMessage?: string;
  };
  visitedScenes: number[];
  lastVisit: string;
}

const DEFAULT_STATE: JourneyState = {
  version: STORAGE_VERSION,
  lastScene: 0,
  musicEnabled: false,
  customizations: {},
  visitedScenes: [],
  lastVisit: new Date().toISOString(),
};

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load state from localStorage with validation
 */
export function loadJourneyState(): JourneyState | null {
  if (!isStorageAvailable()) {
    console.warn("localStorage not available");
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as JourneyState;
    
    // Validate structure
    if (
      typeof parsed.lastScene !== "number" ||
      typeof parsed.musicEnabled !== "boolean" ||
      !Array.isArray(parsed.visitedScenes)
    ) {
      console.warn("Invalid stored state, resetting");
      return null;
    }

    // Check version compatibility
    if (parsed.version !== STORAGE_VERSION) {
      console.info("Storage version mismatch, migrating data");
      // Add migration logic here if needed in future
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load journey state:", error);
    return null;
  }
}

/**
 * Save state to localStorage
 */
export function saveJourneyState(state: Partial<JourneyState>): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const current = loadJourneyState() || DEFAULT_STATE;
    const updated: JourneyState = {
      ...current,
      ...state,
      version: STORAGE_VERSION,
      lastVisit: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Failed to save journey state:", error);
    return false;
  }
}

/**
 * Clear all stored state
 */
export function clearJourneyState(): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear journey state:", error);
  }
}

/**
 * Update scene progress
 */
export function saveSceneProgress(sceneNumber: number): void {
  const current = loadJourneyState() || DEFAULT_STATE;
  const visitedScenes = Array.from(new Set([...current.visitedScenes, sceneNumber]));
  
  saveJourneyState({
    lastScene: sceneNumber,
    visitedScenes,
  });
}

/**
 * Save music preference
 */
export function saveMusicPreference(enabled: boolean): void {
  saveJourneyState({ musicEnabled: enabled });
}

/**
 * Save customizations
 */
export function saveCustomizations(customizations: JourneyState["customizations"]): void {
  saveJourneyState({ customizations });
}
