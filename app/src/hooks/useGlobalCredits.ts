import { useState, useEffect, useCallback } from 'react';

interface CreditData {
  available: number;
  used: number;
  total: number;
  lastReset: string;
  requestHistory: number[]; // Timestamps of requests in current minute
  email: string; // User email for persistence
}

const INITIAL_CREDITS = 100;
const RATE_LIMIT_REQUESTS = 3;
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms
const STORAGE_KEY = 'sugesto_global_credits';

export function useGlobalCredits(userEmail: string | null, isAuthenticated: boolean = false) {
  const [credits, setCredits] = useState<CreditData>({
    available: INITIAL_CREDITS,
    used: 0,
    total: INITIAL_CREDITS,
    lastReset: new Date().toISOString(),
    requestHistory: [],
    email: userEmail || '',
  });
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load credits from localStorage
  useEffect(() => {
    const loadCredits = () => {
      try {
        if (!isAuthenticated || !userEmail) {
          setIsLoading(false);
          return;
        }

        // Use user email as key for persistence
        const storageKey = `${STORAGE_KEY}_${userEmail}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
          const data: CreditData = JSON.parse(stored);

          // Check if we need to reset (monthly reset)
          const lastReset = new Date(data.lastReset);
          const now = new Date();
          const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSinceReset >= 30) {
            // Reset monthly credits
            const resetData: CreditData = {
              available: INITIAL_CREDITS,
              used: 0,
              total: INITIAL_CREDITS,
              lastReset: now.toISOString(),
              requestHistory: [],
              email: userEmail,
            };
            localStorage.setItem(storageKey, JSON.stringify(resetData));
            setCredits(resetData);
          } else {
            // Clean old request history (older than 1 minute)
            const now = Date.now();
            const cleanedHistory = data.requestHistory.filter(
              (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
            );

            const updatedData = { ...data, requestHistory: cleanedHistory, email: userEmail };
            setCredits(updatedData);

            // Check if rate limited
            if (cleanedHistory.length >= RATE_LIMIT_REQUESTS) {
              setIsRateLimited(true);
              const oldestRequest = Math.min(...cleanedHistory);
              setRateLimitReset(oldestRequest + RATE_LIMIT_WINDOW);
            }
          }
        } else {
          // Initialize new user
          const initialData: CreditData = {
            available: INITIAL_CREDITS,
            used: 0,
            total: INITIAL_CREDITS,
            lastReset: new Date().toISOString(),
            requestHistory: [],
            email: userEmail,
          };
          localStorage.setItem(storageKey, JSON.stringify(initialData));
          setCredits(initialData);
        }
      } catch (error) {
        console.error('Error loading credits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredits();
  }, [userEmail, isAuthenticated]);

  // Check and update rate limit status
  useEffect(() => {
    if (!isAuthenticated || !userEmail || credits.requestHistory.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const recentRequests = credits.requestHistory.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
      );

      if (recentRequests.length < RATE_LIMIT_REQUESTS) {
        setIsRateLimited(false);
        setRateLimitReset(0);
      } else {
        setIsRateLimited(true);
        const oldestRequest = Math.min(...recentRequests);
        setRateLimitReset(oldestRequest + RATE_LIMIT_WINDOW);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [credits.requestHistory, isAuthenticated, userEmail]);

  const consumeCredit = useCallback((): { success: boolean; message?: string } => {
    if (!isAuthenticated || !userEmail) {
      return { success: false, message: 'Authentication required' };
    }

    try {
      const now = Date.now();

      // Clean old requests from history
      const recentRequests = credits.requestHistory.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
      );

      // Check rate limit
      if (recentRequests.length >= RATE_LIMIT_REQUESTS) {
        const oldestRequest = Math.min(...recentRequests);
        const resetTime = oldestRequest + RATE_LIMIT_WINDOW;
        const waitSeconds = Math.ceil((resetTime - now) / 1000);

        setIsRateLimited(true);
        setRateLimitReset(resetTime);

        return {
          success: false,
          message: `Rate limit exceeded. Please wait ${waitSeconds} seconds.`,
        };
      }

      // Check credit availability
      if (credits.available <= 0) {
        return {
          success: false,
          message: 'No credits available. Credits reset monthly.',
        };
      }

      // Use one credit
      const newData: CreditData = {
        available: credits.available - 1,
        used: credits.used + 1,
        total: credits.total,
        lastReset: credits.lastReset,
        requestHistory: [...recentRequests, now],
        email: userEmail,
      };

      const storageKey = `${STORAGE_KEY}_${userEmail}`;
      localStorage.setItem(storageKey, JSON.stringify(newData));
      setCredits(newData);

      return { success: true };
    } catch (error) {
      console.error('Error using credit:', error);
      return { success: false, message: 'Error processing request' };
    }
  }, [credits, userEmail, isAuthenticated]);

  const resetCredits = () => {
    if (!userEmail) return;

    try {
      const resetData: CreditData = {
        available: INITIAL_CREDITS,
        used: 0,
        total: INITIAL_CREDITS,
        lastReset: new Date().toISOString(),
        requestHistory: [],
        email: userEmail,
      };
      const storageKey = `${STORAGE_KEY}_${userEmail}`;
      localStorage.setItem(storageKey, JSON.stringify(resetData));
      setCredits(resetData);
      setIsRateLimited(false);
      setRateLimitReset(0);
    } catch (error) {
      console.error('Error resetting credits:', error);
    }
  };

  return {
    credits,
    isRateLimited,
    rateLimitReset,
    isLoading,
    consumeCredit,
    resetCredits,
    rateLimit: {
      requests: RATE_LIMIT_REQUESTS,
      window: RATE_LIMIT_WINDOW,
      current: credits.requestHistory.filter(
        (t) => Date.now() - t < RATE_LIMIT_WINDOW
      ).length,
    },
  };
}
