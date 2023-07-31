import { createContext, useContext, useRef } from 'react';

export const ContextualBarCtx = createContext({
  ref: null,
  children: [],
});

export const useContextBar = () => {
  const ctx = useContext(ContextualBarCtx);
  const ref = useRef();
  ctx.ref = ref;

  return ctx;
};
