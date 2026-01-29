import { useState, useEffect } from 'react';

interface FreeTrialData {
  count: number;
  lastUsed: string;
}

const MAX_FREE_TRIALS = 3;
const STORAGE_KEY = 'sugesto_free_trials';

export function useFreeTrial(toolName: string) {
  const [remainingTrials, setRemainingTrials] = useState<number>(MAX_FREE_TRIALS);
  const [hasExceededLimit, setHasExceededLimit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load trial data from localStorage
    const loadTrialData = () => {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY}_${toolName}`);
        if (stored) {
          const data: FreeTrialData = JSON.parse(stored);
          const remaining = MAX_FREE_TRIALS - data.count;
          setRemainingTrials(Math.max(0, remaining));
          setHasExceededLimit(data.count >= MAX_FREE_TRIALS);
        }
      } catch (error) {
        console.error('Error loading trial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrialData();
  }, [toolName]);

  const consumeTrial = () => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${toolName}`);
      const currentData: FreeTrialData = stored
        ? JSON.parse(stored)
        : { count: 0, lastUsed: new Date().toISOString() };

      const newCount = currentData.count + 1;
      const newData: FreeTrialData = {
        count: newCount,
        lastUsed: new Date().toISOString(),
      };

      localStorage.setItem(`${STORAGE_KEY}_${toolName}`, JSON.stringify(newData));

      const remaining = MAX_FREE_TRIALS - newCount;
      setRemainingTrials(Math.max(0, remaining));

      if (newCount >= MAX_FREE_TRIALS) {
        setHasExceededLimit(true);
      }

      return remaining > 0;
    } catch (error) {
      console.error('Error updating trial data:', error);
      return false;
    }
  };

  const resetTrials = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${toolName}`);
      setRemainingTrials(MAX_FREE_TRIALS);
      setHasExceededLimit(false);
    } catch (error) {
      console.error('Error resetting trial data:', error);
    }
  };

  return {
    remainingTrials,
    hasExceededLimit,
    consumeTrial,
    resetTrials,
    isLoading,
    maxTrials: MAX_FREE_TRIALS,
  };
}
