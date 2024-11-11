import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ProductById from './product-by-id.graphql';
import ProductByKey from './product-by-key.graphql';
import ProductSearch from './product-search.graphql';
import { Product } from './types';

const localizePath = (product: Product) => {
  return `${product.masterData?.current?.name} (${product.masterData?.current?.masterVariant?.sku})`;
};

const ProductSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Product>
> = (props) => {
  const optionMapper = (data: Result<Product>) =>
    data.products.results.map((product: Product): TEntity => {
      return {
        id: product.id,
        name: localizePath(product),
        key: product.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `key = "${text}" or masterData(current(name(en-US = "${text}"))) or masterData(current(masterVariant(sku = "${text}")))`,
  });
  return (
    <AsyncSearchInput<Product, Result<Product>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={ProductSearch}
      byKeyQuery={ProductByKey}
      byIdQuery={ProductById}
      {...props}
    />
  );
};
ProductSearchInput.displayName = 'CustomerSearchInput';

export default ProductSearchInput;
