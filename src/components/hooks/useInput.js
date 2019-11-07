// @flow
import { useCallback, useState } from 'react';

const useInput = (defaultValue :any, numeric ? :boolean = false) => {
  const [inputValue, setValue] = useState(defaultValue);
  const setInput = useCallback((event :SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const nextValue = numeric ? parseFloat(value) : value;
    setValue(nextValue);
  }, [numeric, setValue]);

  return [inputValue, setInput];
};

export default useInput;
