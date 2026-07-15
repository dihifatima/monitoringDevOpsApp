import { useState } from 'react';

export function useFormState<T extends Record<string, string>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);

  const setField = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setValues(initialValues);

  return { values, setField, reset };
}