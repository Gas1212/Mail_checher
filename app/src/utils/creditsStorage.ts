/**
 * Credits Storage Utility
 *
 * Provides robust credit storage that persists across cookie deletions
 * Uses multiple storage strategies for redundancy
 */

interface CreditData {
  available: number;
  used: number;
  total: number;
  lastReset: string;
  requestHistory: number[];
  email: string;
}

const STORAGE_KEY_PREFIX = 'sugesto_global_credits';

/**
 * Save credits to localStorage with email-based key
 */
export function saveCredits(email: string, credits: CreditData): void {
  if (!email) return;

  try {
    const key = `${STORAGE_KEY_PREFIX}_${email}`;
    localStorage.setItem(key, JSON.stringify(credits));
  } catch (error) {
    console.error('Error saving credits to localStorage:', error);
  }
}

/**
 * Load credits from localStorage
 */
export function loadCredits(email: string): CreditData | null {
  if (!email) return null;

  try {
    const key = `${STORAGE_KEY_PREFIX}_${email}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading credits from localStorage:', error);
  }

  return null;
}

/**
 * Delete credits for a specific email
 */
export function deleteCredits(email: string): void {
  if (!email) return;

  try {
    const key = `${STORAGE_KEY_PREFIX}_${email}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting credits:', error);
  }
}

/**
 * Clean up old credit entries (migration helper)
 */
export function cleanupOldCredits(): void {
  try {
    // Remove old per-tool credit entries
    const oldKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith('sugesto_credits_') &&
               !key.startsWith(STORAGE_KEY_PREFIX)
    );

    oldKeys.forEach((key) => localStorage.removeItem(key));

    console.log(`Cleaned up ${oldKeys.length} old credit entries`);
  } catch (error) {
    console.error('Error cleaning up old credits:', error);
  }
}

/**
 * Get all credit entries (for debugging)
 */
export function getAllCredits(): Record<string, CreditData> {
  const credits: Record<string, CreditData> = {};

  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          credits[key] = data;
        } catch (e) {
          // Skip invalid entries
        }
      });
  } catch (error) {
    console.error('Error getting all credits:', error);
  }

  return credits;
}

/**
 * Check if credits exist for an email
 */
export function hasCredits(email: string): boolean {
  if (!email) return false;

  try {
    const key = `${STORAGE_KEY_PREFIX}_${email}`;
    return localStorage.getItem(key) !== null;
  } catch (error) {
    return false;
  }
}
