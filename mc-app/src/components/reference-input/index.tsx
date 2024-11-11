import TextInput from '@commercetools-uikit/text-input';
import get from 'lodash/get';
import React from 'react';
import CategorySearchInput from './search-components/category';
import CustomerSearchInput from './search-components/customer';
import { ReferenceInputProps } from './search-input/types';
import ProductSearchInput from './search-components/product';

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
          value={value}
          referenceBy={referenceBy}
          referenceType="category"
          {...props}
        />
      );
    case 'customer':
      return (
        <CustomerSearchInput
          value={value}
          referenceBy={referenceBy}
          referenceType="customer"
          {...props}
        />
      );
    case 'product':
      return (
        <ProductSearchInput
          value={value}
          referenceBy={referenceBy}
          referenceType="product"
          {...props}
        />
      );

    default:
      return (
        <TextInput
          data-testid="field-type-reference"
          name={`${props.name}.${referenceBy}`}
          value={refValue}
          hasError={props.hasError}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
      );
  }
};

export default ReferenceInput;
