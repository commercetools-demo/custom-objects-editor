import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { SingleValueProps } from 'react-select';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DocumentNode, useQuery } from '@apollo/client';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { getErrorMessage } from '../../helpers';

interface Props<T> {
  referenceBy: 'key' | 'id';
  referenceType: string;
  byKeyQuery: DocumentNode;
  byIdQuery: DocumentNode;
  localizePath: (value: T, ...args: any[]) => string;
}

interface TEntity { key?: string, id: string }

export const SearchSingleValue = <T extends TEntity,>(
  props: SingleValueProps<T> & Props<T>
) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const { data, loading, error } = useQuery<Record<string, any>, { locale: string }>(
    props.referenceBy === 'key' ? props.byKeyQuery : props.byIdQuery,
    {
      variables: {
        [props.referenceBy]: props.data[props.referenceBy],
        locale: dataLocale,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );
  if (!props.data || !props.data[props.referenceBy]) {
    return <AsyncSelectInput.SingleValue {...props} />;
  }
  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }
  if (!data?.[props.referenceType]) {
    return <PageNotFound />;
  }

  return (
    <AsyncSelectInput.SingleValue {...props}>
      {props.localizePath(data[props.referenceType], true)}
    </AsyncSelectInput.SingleValue>
  );
};
