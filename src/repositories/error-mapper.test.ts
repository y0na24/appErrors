import { describe, expect, it } from 'vitest'
import { RepositoryError } from '../domain/repository-error'
import { createClientError } from '../test/client-error'
import {
  mapHttpResponseToRepositoryError,
  mapToRepositoryError,
} from './error-mapper'

describe('mapToRepositoryError', () => {
  it('maps GraphQL ClientError fields to RepositoryError fields', () => {
    const fields = {
      title: ['Title is required.'],
      ownerId: ['Owner does not exist.'],
    }

    const error = mapToRepositoryError(createClientError({ status: 422, fields }))

    expect(error).toBeInstanceOf(RepositoryError)
    expect(error.kind).toBe('validation')
    expect(error.status).toBe(422)
    expect(error.message).toBe('GraphQL validation failed.')
    expect(error.fields).toEqual(fields)
  })

  it('maps fetch HTTP errors with status', () => {
    const error = mapHttpResponseToRepositoryError(
      new Response(null, { status: 503 }),
      { message: 'Service unavailable.' },
    )

    expect(error.kind).toBe('http')
    expect(error.status).toBe(503)
    expect(error.message).toBe('Service unavailable.')
  })

  it('returns RepositoryError unchanged', () => {
    const original = new RepositoryError({
      kind: 'unknown',
      message: 'Already normalized.',
    })

    expect(mapToRepositoryError(original)).toBe(original)
  })
})
