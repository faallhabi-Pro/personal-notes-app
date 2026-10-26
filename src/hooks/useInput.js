import { useCallback, useState } from 'react';

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return [value, handleValueChange, setValue];
}

export default useInput;
