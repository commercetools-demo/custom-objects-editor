import { useState } from 'react';

interface Props {
  referenceBy: 'key' | 'id';
  referenceType: string;
  initialValue: any;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
}

export const useSearchInput = ({
  referenceBy,
  referenceType,
  initialValue,
  onChange,
  onBlur,
}: Props) => {
  const [localValue, setLocalValue] = useState<any>(initialValue);

  const handleChange = (event: any) => {
    setLocalValue(event.target.value);
    onChange({
      ...event,
      target: {
        ...event.target,
        value: {
          [referenceBy]: event.target.value?.[referenceBy],
          typeId: referenceType,
        },
      },
    });
  };

  const handleBlur = (event: any) => {
    setLocalValue(event.target.value);
    onBlur({
      ...event,
      target: {
        ...event.target,
        value: {
          [referenceBy]: event.target.value?.[referenceBy],
          typeId: referenceType,
        },
      },
    });
  };
  return {
    handleChange,
    handleBlur,
    value: localValue,
  };
};
