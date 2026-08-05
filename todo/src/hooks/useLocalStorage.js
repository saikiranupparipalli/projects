import { useState, useEffect } from 'react';
import { loadStoredData, saveStoredData } from '../utils/storage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return loadStoredData(key, initialValue);
  });

  useEffect(() => {
    saveStoredData(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
