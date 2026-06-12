import { RepositoryError } from '../error/repository-error'
import type { Task, TasksRepository } from '../domain/task'

export class TasksService {
  private readonly repository: TasksRepository

  constructor(repository: TasksRepository) {
    this.repository = repository
  }

  async getTasks(): Promise<Task[]> {
    try {
      return await this.repository.getTasks()
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error
      }

      throw new RepositoryError({
        kind: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown service error.',
        cause: error,
      })
    }
  }
}
