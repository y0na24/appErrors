import type { Task, TasksRepository } from '../domain/task'
import {
  mapHttpResponseToRepositoryError,
  mapToRepositoryError,
} from './error-mapper'

type FetchTasksRepositoryOptions = {
  endpoint?: string
}

export class FetchTasksRepository implements TasksRepository {
  private readonly endpoint: string

  constructor({ endpoint = '/api/tasks' }: FetchTasksRepositoryOptions = {}) {
    this.endpoint = endpoint
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(this.endpoint)
      const payload = await response.json()

      if (!response.ok) {
        throw mapHttpResponseToRepositoryError(response, payload)
      }

      return payload as Task[]
    } catch (error) {
      throw mapToRepositoryError(error)
    }
  }
}
