import { describe, expect, it } from 'vitest'
import { RepositoryError } from '../error/repository-error'
import type { Task, TasksRepository } from '../domain/task'
import { TasksService } from './tasks-service'

const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Use repository abstraction',
    completed: false,
  },
]

describe('TasksService', () => {
  it('returns tasks from repository', async () => {
    const repository: TasksRepository = {
      getTasks: async () => tasks,
    }

    await expect(new TasksService(repository).getTasks()).resolves.toEqual(tasks)
  })

  it('passes RepositoryError through unchanged', async () => {
    const repositoryError = new RepositoryError({
      kind: 'http',
      message: 'Repository failed.',
      status: 500,
    })

    const repository: TasksRepository = {
      getTasks: async () => {
        throw repositoryError
      },
    }

    await expect(new TasksService(repository).getTasks()).rejects.toBe(
      repositoryError,
    )
  })
})
