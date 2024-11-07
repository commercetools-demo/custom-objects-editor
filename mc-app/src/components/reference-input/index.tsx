import React from 'react';
import get from 'lodash/get';
import CategorySearchInput from './search-components/category';
import { ReferenceInputProps } from './search-input/types';
import CustomerSearchInput from './search-components/customer';

const ReferenceInput: React.FC<
  React.HTMLAttributes<HTMLDivElement> & ReferenceInputProps
> = ({ reference, value, ...props }) => {
  const referenceBy: 'id' | 'key' = get(reference, 'by', 'id') as 'id' | 'key';
  const referenceType = get(reference, 'type');
  const refValue = get(value, referenceBy, '');

  switch (referenceType) {
    case 'category':
      return (
        <CategorySearchInput
          value={refValue}
          referenceBy={referenceBy}
          referenceType="category"
          {...props}
        />
      );
    case 'customer':
      return (
        <CustomerSearchInput
          value={refValue}
          referenceBy={referenceBy}
          referenceType="customer"
          {...props}
        />
      );

    default:
      break;
  }

  return <div>ReferenceInput</div>;
};

export default ReferenceInput;
