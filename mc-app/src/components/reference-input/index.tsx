import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import TextInput from '@commercetools-uikit/text-input';
import get from 'lodash/get';
import React, { Suspense, lazy } from 'react';
import { ReferenceInputProps } from './search-input/types';
import { Link } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const referenceTypeToComponentMap: Record<string, any> = {
  category: lazy(() => import('./search-components/category')),
  customer: lazy(() => import('./search-components/customer')),
  product: lazy(() => import('./search-components/product')),
  cart: lazy(() => import('./search-components/cart')),
  'cart-discount': lazy(() => import('./search-components/cart-discount')),
  channel: lazy(() => import('./search-components/channel')),
  'customer-group': lazy(() => import('./search-components/customer-group')),
  'discount-code': lazy(() => import('./search-components/discount-code')),
  'key-value-document': lazy(
    () => import('./search-components/key-value-document')
  ),
};

const referenceTypeToMCPageMap: Record<string, string> = {
  category: '/categories',
  customer: '/customers',
  product: '/products',
  'cart-discount': '/discounts/carts',
  channel: '/settings/project/channels',
  'customer-group': '/customers/customer-groups',
  'discount-code': '/discounts/codes',
};

const restrictedReferenceTypesToReferenceBy = [
  {
    referenceType: 'key-value-document',
    referenceBy: 'key',
  },
];

const referenceTypeToSingleValueMap: Record<string, string> = {
  'cart-discount': 'cartDiscount',
  'customer-group': 'customerGroup',
  'discount-code': 'discountCode',
  'key-value-document': 'customObject',
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
  const { project } = useApplicationContext();
  const referenceBy: 'id' | 'key' = get(reference, 'by', 'id') as 'id' | 'key';
  const referenceType = get(reference, 'type');
  const refValue = get(value, referenceBy, '');
  const inRestrictedList = restrictedReferenceTypesToReferenceBy.some(
    (item) => {
      return (
        item.referenceType === referenceType && item.referenceBy === referenceBy
      );
    }
  );

  const externalUrl = referenceBy === 'id' && referenceTypeToMCPageMap[referenceType as string] ? 
    `/${project?.key}/${referenceTypeToMCPageMap[referenceType as string]}/${refValue}` : '';

  if (referenceType && referenceTypeToComponentMap[referenceType]) {
    if (!inRestrictedList) {
      const Component = referenceTypeToComponentMap[referenceType];
      const singleValueQueryDataObject = referenceTypeToSingleValueMap[
        referenceType
      ]
        ? referenceTypeToSingleValueMap[referenceType]
        : referenceType;
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Spacings.Inline alignItems="center" justifyContent="space-between">
              <Component
                value={value}
                referenceBy={referenceBy}
                referenceType={singleValueQueryDataObject}
                {...props}
              />
              {!!externalUrl && <Link
                to={externalUrl}
                target="_blank"
              >
                <ExternalLinkIcon color='info' />
              </Link>}
            </Spacings.Inline>
          </Suspense>
        </ErrorBoundary>
      );
    }
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
