import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import CategorySearch from './category-search.graphql';
import CategoryById from './category-by-id.graphql';
import CategoryByKey from './category-by-key.graphql';
// import { CategoryValue } from "../category-field/category-field";
import { OptionProps, SingleValueProps } from 'react-select';
import { SearchIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SearchSingleValue } from '../search-single-value';

const localizePath = (category: any, showProductCount = false) => {
  let path = category.ancestors
    .map((ancestor) => ancestor.name)
    .concat([category.name])
    .join(' > ');
  if (showProductCount) {
    path = `${path} (${category.stagedProductCount})`;
  }
  return path;
};

const CategorySearchOption: FC<OptionProps<any>> = (props) => {
  return (
    <AsyncSelectInput.Option {...props}>
      <Spacings.Stack scale="xs">
        <Text.Detail isBold>{props.data.name}</Text.Detail>
      </Spacings.Stack>
    </AsyncSelectInput.Option>
  );
};

type Props = {
  name: string;
  value?: any | null;
  placeholder?: string;
  showProductCount?: boolean;
  hasError?: boolean;
  referenceBy: 'key' | 'id';
  referenceType: string;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
};

const CategorySearchInput: FC<React.HTMLAttributes<HTMLDivElement> & Props> = ({
  name,
  value,
  placeholder,
  showProductCount = false,
  hasError,
  referenceBy,
  referenceType,
  onChange,
  onBlur,
  ...props
}) => {
  const [localValue, setLocalValue] = useState<Record<string, any>>({
    [referenceBy]: value,
  });
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const { refetch } = useQuery<
    { categories: { results: Array<any> } },
    {
      limit: number;
      offset: number;
      fullText?: { locale: string; text: string };
      locale: string;
    }
  >(CategorySearch, {
    skip: true,
    variables: {
      limit: 20,
      offset: 0,
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const loadOptions = (text: string) =>
    refetch({
      fullText: { locale: dataLocale, text },
    }).then((response) => {
      return response.data.categories.results.map((category): any => {
        return {
          id: category.id,
          name: localizePath(category, showProductCount),
          key: category.key,
        };
      });
    });
  return (
    <AsyncSelectInput
      {...props}
      name={name}
      value={localValue}
      placeholder={placeholder}
      isClearable
      isSearchable
      cacheOptions={20}
      loadOptions={loadOptions}
      components={{
        SingleValue: (props: SingleValueProps<any>) => (
          <SearchSingleValue<any>
            {...props}
            referenceBy={referenceBy}
            referenceType={referenceType}
            byIdQuery={CategoryById}
            byKeyQuery={CategoryByKey}
            localizePath={localizePath}
          />
        ),
        Option: CategorySearchOption,
        DropdownIndicator: () => <SearchIcon color="primary" />,
      }}
      hasError={hasError}
      onBlur={onBlur}
      onChange={(event) => {
        setLocalValue(event.target.value);
        onChange({
          ...event,
          target: {
            ...event.target,
            value: event.target.value[referenceBy],
          },
        });
      }}
    />
  );
};
CategorySearchInput.displayName = 'CategorySearchInput';

export default CategorySearchInput;
