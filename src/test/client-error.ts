import { ClientError } from 'graphql-request'
import { GraphQLError } from 'graphql'

type CreateClientErrorOptions = {
  status?: number
  message?: string
  fields?: Record<string, string[]>
}

export function createClientError({
  status = 400,
  message = 'GraphQL validation failed.',
  fields,
}: CreateClientErrorOptions = {}): ClientError {
  const errors = [
    new GraphQLError(
      message,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      fields ? { fields } : undefined,
    ),
  ]

  return new ClientError(
    {
      data: undefined,
      errors,
      body: JSON.stringify({ errors }),
      status,
      headers: new Headers(),
    },
    {
      query: 'query Tasks { tasks { id } }',
      variables: undefined,
    },
  )
}
