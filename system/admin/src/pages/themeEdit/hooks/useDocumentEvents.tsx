import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export const useDocumentEvent = (events: any[]) => {
  useEffect(() => {
    events.forEach((event) => {
      document.addEventListener(event.type, event.callback);
    });
    return () =>
      events.forEach((event) => {
        document.removeEventListener(event.type, event.callback);
      });
  }, [events]);
};

type DropdownT<T> = [MutableRefObject<T>, boolean, Dispatch<SetStateAction<boolean>>];

/**
 * Functions which performs a click outside event listener
 * @param {*} initialState initialState of the dropdown
 * @param {*} onAfterClose some extra function call to do after closing dropdown
 */
export function useDropdown<T extends HTMLElement>(initialState = false, onAfterClose = null): DropdownT<T> {
  const ref = useRef<T>(null);
  const [isOpen, setIsOpen] = useState(initialState);

  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setIsOpen(false);
      onAfterClose && onAfterClose();
    },
    [ref, onAfterClose],
  );

  const handleHideDropdown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        onAfterClose && onAfterClose();
      }
    },
    [onAfterClose],
  );

  useDocumentEvent([
    { type: 'click', callback: handleClickOutside },
    { type: 'keydown', callback: handleHideDropdown },
  ]);

  return [ref, isOpen, setIsOpen];
}
