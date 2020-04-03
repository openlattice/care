// @flow
import { useEffect, useState } from 'react';

const usePosition = (timeout :number = 0) :[Position, PositionError] => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = (pos :Position) => {
    setPosition(pos);
  };

  const onError = (posError :PositionError) => {
    setError(posError);
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    const options = { timeout };
    geo.getCurrentPosition(onChange, onError, options);
  }, [timeout]);

  return [position, error];
};

export default usePosition;
