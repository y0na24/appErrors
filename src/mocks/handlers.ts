import { graphql, http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/tasks', () => {
    return HttpResponse.json(
      { message: 'Fetch repository returned an HTTP error.' },
      { status: 503 },
    )
  }),

  graphql.query('Tasks', () => {
    return HttpResponse.json({
      errors: [
        {
          message: 'GraphQL validation failed.',
          extensions: {
            fields: {
              tasks: ['Tasks query cannot be resolved right now.'],
            },
          },
        },
      ],
    })
  }),
]
