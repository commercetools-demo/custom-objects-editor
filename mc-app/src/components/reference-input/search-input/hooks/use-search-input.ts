import { useState } from 'react';

interface Props {
  referenceBy: 'key' | 'id';
  initialValue: any;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
}

export const useSearchInput = ({
  referenceBy,
  initialValue,
  onChange,
  onBlur,
}: Props) => {
  const [localValue, setLocalValue] = useState<Record<string, any>>({
    [referenceBy]: initialValue,
  });

  const handleChange = (event: any) => {
    setLocalValue(event.target.value);
    onChange({
      ...event,
      target: {
        ...event.target,
        value: event.target.value?.[referenceBy],
      },
    });
  };

  const handleBlur = (event: any) => {
    setLocalValue(event.target.value);
    onBlur({
      ...event,
      target: {
        ...event.target,
        value: event.target.value?.[referenceBy],
      },
    });
  };
  return {
    handleChange,
    handleBlur,
    value: localValue,
  };
};
