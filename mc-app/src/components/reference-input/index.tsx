import React from 'react';
import get from 'lodash/get';
import { CategorySearchInput } from './category-search-input';

type Props = {
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
  name: string;
  value?: any;
  hasError?: boolean;
  reference?: {
    by?: string;
    type?: string;
  };
};

const ReferenceInput: React.FC<
  React.HTMLAttributes<HTMLDivElement> & Props
> = ({ reference, value, ...props }) => {
  const referenceBy: 'id' | 'key' = get(reference, 'by', 'id') as 'id' | 'key';
  const referenceType: string = get(reference, 'type');
  const refValue = get(value, referenceBy, '');

  switch (reference?.type) {
    case 'category':
      return (
        <CategorySearchInput
          value={refValue}
          referenceBy={referenceBy}
          referenceType={referenceType}
          {...props}
        />
      );

    default:
      break;
  }

  return <div>ReferenceInput</div>;
};

export default ReferenceInput;
