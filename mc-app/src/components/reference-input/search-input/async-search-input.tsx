import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { SearchIcon } from '@commercetools-uikit/icons';
import { SingleValueProps } from 'react-select';
import { TEntity } from '../types';
import { useSearchInput } from './hooks/use-search-input';
import { AsyncSelectOption } from './search-option';
import { SearchSingleValue } from './search-single-value';
import { AsyncSearchInputProps, Result } from './types';

const AsyncSearchInput = <T extends TEntity, R extends Result<T>>({
  name,
  value: initialValue,
  placeholder,
  hasError,
  referenceBy,
  referenceType,
  byIdQuery,
  byKeyQuery,
  searchQuery,
  onChange,
  onBlur,
  optionMapper,
  variableBuilder,
  localizePath,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & AsyncSearchInputProps<T, R>) => {
  const { value, handleChange, handleBlur } = useSearchInput({
    referenceBy,
    initialValue,
    onChange,
    onBlur,
  });
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const { refetch } = useQuery<R, any>(searchQuery, {
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
    refetch(variableBuilder(text)).then((response) =>
      optionMapper(response.data)
    );

  return (
    <AsyncSelectInput
      {...props}
      isOptionDisabled={(option: any) => !!option.disabled}
      name={name}
      value={value}
      placeholder={placeholder}
      isClearable
      isSearchable
      cacheOptions={20}
      loadOptions={loadOptions}
      components={{
        SingleValue: (props: SingleValueProps<any>) => (
          <SearchSingleValue<T>
            {...props}
            referenceBy={referenceBy}
            referenceType={referenceType}
            byIdQuery={byIdQuery}
            byKeyQuery={byKeyQuery}
            localizePath={localizePath}
          />
        ),
        Option: AsyncSelectOption,
        DropdownIndicator: () => <SearchIcon color="primary" />,
      }}
      hasError={hasError}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};
AsyncSearchInput.displayName = 'AsyncSearchInput';

export default AsyncSearchInput;