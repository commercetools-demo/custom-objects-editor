import { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import axios from 'axios';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import {
  TCustomObjectDraft,
  TMutation,
  TMutation_CreateOrUpdateCustomObjectArgs,
  TMutation_DeleteCustomObjectArgs,
  TQuery,
  TQuery_CustomObjectArgs,
  TQuery_CustomObjectsArgs,
} from '../../types/generated/ctp';
import DeleteCustomObject from './delete-custom-object.rest.graphql';
import GetCustomObject from './get-custom-object.rest.graphql';
import GetCustomObjects from './get-custom-objects.ctp.graphql';
import UpdateCustomObject from './update-custom-object.rest.graphql';

type TUseCustomObjectsFetcher = (variables: TQuery_CustomObjectsArgs) => {
  customObjectsPaginatedResult?: TQuery['customObjects'];
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};

export const useCustomObjectsFetcher: TUseCustomObjectsFetcher = (
  variables: TQuery_CustomObjectsArgs
) => {
  const { data, loading, error, refetch } = useMcQuery<
    TQuery,
    TQuery_CustomObjectsArgs
  >(GetCustomObjects, {
    variables: variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customObjectsPaginatedResult: data?.customObjects,
    error,
    loading,
    refetch,
  };
};

type TUseCustomObjectFetcher = (variables: TQuery_CustomObjectArgs) => {
  customObject?: TQuery['customObject'];
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};

export const useCustomObjectFetcher: TUseCustomObjectFetcher = (
  variables: TQuery_CustomObjectArgs
) => {
  const { data, loading, error, refetch } = useMcQuery<
    TQuery,
    TQuery_CustomObjectArgs
  >(GetCustomObject, {
    variables: variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customObject: data?.customObject,
    error,
    loading,
    refetch,
  };
};

export const useCustomObjectUpdater = () => {
  const [updateCustomObject] = useMcMutation<
    TMutation,
    TMutation_CreateOrUpdateCustomObjectArgs
  >(UpdateCustomObject);

  const { customObjectEndpoint, useCustomObjectEndpoint } =
    useApplicationContext<
      {
        customObjectEndpoint: string;
        useCustomObjectEndpoint: string;
      },
      any
    >((context) => context.environment);

  const updateWithCustomObjectEndpoint = async ({
    draft,
    onCompleted,
    onError,
  }: {
    draft: NonNullable<TCustomObjectDraft>;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      await axios
        .post(
          customObjectEndpoint,
          {
            container: draft.container,
            key: draft.key,
            value: draft.value,
            schemaType: draft.container,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then(async (res) => {
          if (res?.status === 200) {
            return res.data;
          }
          throw res.status;
        });

      onCompleted && onCompleted();
    } catch (error) {
      onError && onError(error.message);
    }
  };

  const updateWithGraphQL = async ({
    draft,
    onCompleted,
    onError,
  }: {
    draft: NonNullable<TCustomObjectDraft>;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      return await updateCustomObject({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          draft: draft,
        },
        onCompleted() {
          onCompleted && onCompleted();
        },
        onError({ message }) {
          onError && onError(message);
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    execute: useCustomObjectEndpoint
      ? updateWithCustomObjectEndpoint
      : updateWithGraphQL,
  };
};

export const useCustomObjectDeleter = () => {
  const [deleteCustomObject, { loading }] = useMcMutation<
    TMutation,
    TMutation_DeleteCustomObjectArgs
  >(DeleteCustomObject);

  const execute = async ({
    id,
    version,
    onCompleted,
    onError,
  }: {
    id: string;
    version: number;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      return await deleteCustomObject({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          id: id,
          version: version,
        },
        onCompleted() {
          onCompleted && onCompleted();
        },
        onError({ message }) {
          onError && onError(message);
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
