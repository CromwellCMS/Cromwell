import { useState } from 'react';

export function useForceUpdate() {
  const state = useState(0);
  return () => state[1]((value) => ++value);
}
