import TextInput from '@commercetools-uikit/text-input';
import get from 'lodash/get';
import React, { Suspense, lazy } from 'react';
import { ReferenceInputProps } from './search-input/types';

// TODO: fix dynamic imports
const referenceTypeToComponentMap: Record<string, any> = {
  category: lazy(() => import('./search-components/category')),
  customer: lazy(() => import('./search-components/customer')),
  product: lazy(() => import('./search-components/product')),
  cart: lazy(() => import('./search-components/cart')),
  'cart-discount': lazy(() => import('./search-components/cart-discount')),
  channel: lazy(() => import('./search-components/channel')),
  'customer-group': lazy(() => import('./search-components/customer-group')),
};

const referenceTypeToSingleValueMap: Record<string, string> = {
  'cart-discount': 'cartDiscount',
  'customer-group': 'customerGroup',
};

const LoadingFallback: React.FC = () => <div className="p-4">Loading...</div>;

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4">Error loading component</div>;
    }
    return this.props.children;
  }
}

const ReferenceInput: React.FC<
  React.HTMLAttributes<HTMLDivElement> & ReferenceInputProps
> = ({ reference, value, ...props }) => {
  const referenceBy: 'id' | 'key' = get(reference, 'by', 'id') as 'id' | 'key';
  const referenceType = get(reference, 'type');
  const refValue = get(value, referenceBy, '');

  if (referenceType && referenceTypeToComponentMap[referenceType]) {
    const Component = referenceTypeToComponentMap[referenceType];
    const singleValueQueryDataObject = referenceTypeToSingleValueMap[referenceType] ? referenceTypeToSingleValueMap[referenceType] : referenceType;
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Component
            value={value}
            referenceBy={referenceBy}
            referenceType={singleValueQueryDataObject}
            {...props}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }
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
};

export default ReferenceInput;
