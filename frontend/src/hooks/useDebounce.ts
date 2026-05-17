import { useState, useEffect } from 'react';

// This hook delays updating the value until 'delay' milliseconds have passed
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the user types again before the timer finishes, clear it and start over
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}