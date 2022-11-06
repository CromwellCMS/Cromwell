import React, { useEffect, useState } from 'react';

export function useDebounceFn<T extends (...args: any) => void>(fn: T, delay: number, trail = true): T {
  const timeoutId = React.useRef<NodeJS.Timeout>();
  const originalFn = React.useRef<T>();
  const wasCalled = React.useRef<boolean>(false);

  React.useEffect(() => {
    originalFn.current = fn;
    () => {
      originalFn.current = null;
    };
  }, [fn]);

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return React.useMemo<any>(
    () =>
      (...args: any) => {
        clearTimeout(timeoutId.current);

        if (trail) {
          timeoutId.current = setTimeout(() => {
            if (originalFn.current) {
              originalFn.current(...args);
            }
          }, delay);
        } else {
          if (!wasCalled.current) {
            wasCalled.current = true;
            if (originalFn.current) {
              originalFn.current(...args);
            }
          } else {
            timeoutId.current = setTimeout(() => {
              wasCalled.current = false;
            }, delay);
          }
        }
      },
    [delay],
  );
}

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
