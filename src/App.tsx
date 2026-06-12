import { useMemo, useState } from 'react'
import { RepositoryError } from './error/repository-error'
import type { Task, TasksRepository } from './domain/task'
import { FetchTasksRepository } from './repositories/fetch-tasks-repository'
import { GraphQLTasksRepository } from './repositories/graphql-tasks-repository'
import { TasksService } from './services/tasks-service'

type Transport = 'fetch' | 'graphql'
type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; tasks: Task[] }
  | { status: 'error'; error: RepositoryError }

function App() {
  const [transport, setTransport] = useState<Transport>('fetch')
  const [state, setState] = useState<LoadState>({ status: 'idle' })

  const service = useMemo(() => {
    return new TasksService(createRepository(transport))
  }, [transport])

  async function loadTasks() {
    setState({ status: 'loading' })

    try {
      const tasks = await service.getTasks()
      setState({ status: 'success', tasks })
    } catch (error) {
      setState({
        status: 'error',
        error:
          error instanceof RepositoryError
            ? error
            : new RepositoryError({
                kind: 'unknown',
                message:
                  error instanceof Error ? error.message : 'Unknown UI error.',
                cause: error,
              }),
      })
    }
  }

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">Repository error mapping</p>
        <h1>Tasks repository demo</h1>
        <p>
          <code>TasksService</code> works with <code>TasksRepository</code>.
          Fetch and GraphQL errors are mapped to one <code>RepositoryError</code>.
        </p>
      </section>

      <section className="controls" aria-label="Repository controls">
        <fieldset>
          <legend>Transport</legend>
          <label>
            <input
              checked={transport === 'fetch'}
              name="transport"
              onChange={() => setTransport('fetch')}
              type="radio"
            />
            fetch
          </label>
          <label>
            <input
              checked={transport === 'graphql'}
              name="transport"
              onChange={() => setTransport('graphql')}
              type="radio"
            />
            GraphQL
          </label>
        </fieldset>

        <button disabled={state.status === 'loading'} onClick={loadTasks}>
          {state.status === 'loading' ? 'Loading...' : 'Load tasks'}
        </button>
      </section>

      <section className="result" aria-live="polite">
        {state.status === 'idle' && (
          <p className="muted">Choose fetch or GraphQL and load tasks.</p>
        )}

        {state.status === 'loading' && <p className="muted">Loading tasks...</p>}

        {state.status === 'success' && (
          <ul className="tasks">
            {state.tasks.map((task) => (
              <li key={task.id}>
                <span aria-hidden="true">{task.completed ? 'done' : 'todo'}</span>
                <strong>{task.title}</strong>
              </li>
            ))}
          </ul>
        )}

        {state.status === 'error' && <RepositoryErrorView error={state.error} />}
      </section>
    </main>
  )
}

function createRepository(transport: Transport): TasksRepository {
  if (transport === 'graphql') {
    return new GraphQLTasksRepository()
  }

  return new FetchTasksRepository()
}

function RepositoryErrorView({ error }: { error: RepositoryError }) {
  return (
    <article className="error">
      <h2>{error.message}</h2>
      <dl>
        <div>
          <dt>kind</dt>
          <dd>{error.kind}</dd>
        </div>
        {error.status && (
          <div>
            <dt>status</dt>
            <dd>{error.status}</dd>
          </div>
        )}
      </dl>

      {error.fields && (
        <div>
          <h3>fields</h3>
          <pre>{JSON.stringify(error.fields, null, 2)}</pre>
        </div>
      )}
    </article>
  )
}

export default App
