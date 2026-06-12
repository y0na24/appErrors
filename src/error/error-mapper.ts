import { ClientError } from 'graphql-request'
import {
  RepositoryError,
  type RepositoryErrorFields,
} from './repository-error'

export function mapToRepositoryError(error: unknown): RepositoryError {
  if (error instanceof RepositoryError) {
    return error
  }

  if (error instanceof ClientError) {
    const graphQLError = error.response.errors?.[0]
    const fields = graphQLError?.extensions?.fields as
      | RepositoryErrorFields
      | undefined

    return new RepositoryError({
      kind: fields ? 'validation' : 'http',
      message: graphQLError?.message ?? 'GraphQL request failed.',
      status: error.response.status,
      fields,
      cause: error,
    })
  }

  if (error instanceof TypeError) {
    return new RepositoryError({
      kind: 'network',
      message: 'Network request failed.',
      cause: error,
    })
  }

  return new RepositoryError({
    kind: 'unknown',
    message: error instanceof Error ? error.message : 'Unknown repository error.',
    cause: error,
  })
}

export function mapHttpResponseToRepositoryError(
  response: Response,
  payload: unknown,
): RepositoryError {
  const { message } = payload as { message: string }

  return new RepositoryError({
    kind: 'http',
    message,
    status: response.status,
    cause: payload,
  })
}
