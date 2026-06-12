export type RepositoryErrorKind =
  | 'network'
  | 'http'
  | 'validation'
  | 'unknown'

export type RepositoryErrorFields = Record<string, string[]>

type RepositoryErrorOptions = {
  kind: RepositoryErrorKind
  message: string
  status?: number
  fields?: RepositoryErrorFields
  cause?: unknown
}

export class RepositoryError extends Error {
  readonly kind: RepositoryErrorKind
  readonly status?: number
  readonly fields?: RepositoryErrorFields

  constructor({ kind, message, status, fields, cause }: RepositoryErrorOptions) {
    super(message, { cause })

    this.name = 'RepositoryError'
    this.kind = kind
    this.status = status
    this.fields = fields
  }
}
