import { useState } from 'react';

export function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}
