import { useState } from 'react';

export function useForceUpdate() {
  const state = useState(0);
  return () => state[1]((value) => ++value);
}

export const jsOperators = [
  'let',
  'var',
  'const',
  'function',
  'class',
  'new',
  'delete',
  'import',
  'export',
  'default',
  'typeof',
  'in',
  'of',
  'instanceof',
  'void',
  'return',
  'try',
  'catch',
  'throw',
  'if',
  'else',
  'switch',
  'case',
  'continue',
  'do',
  'while',
];
