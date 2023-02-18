import { useRef, useState } from 'react';

export const useInitialValue = (initialValue: any): [any, React.Dispatch<React.SetStateAction<any>>] => {
  const [value, setValue] = useState(initialValue);
  const initialValueRef = useRef(initialValue);
  if (initialValue !== initialValueRef.current) {
    initialValueRef.current = initialValue;
    setValue(initialValue);
  }
  return [value, setValue];
};
