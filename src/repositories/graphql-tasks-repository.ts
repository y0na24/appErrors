import { gql, GraphQLClient } from 'graphql-request'
import type { Task, TasksRepository } from '../domain/task'
import { mapToRepositoryError } from './error-mapper'

type GraphQLTasksRepositoryOptions = {
  endpoint?: string
}

type TasksQueryResponse = {
  tasks: Task[]
}

const TasksQuery = gql`
  query Tasks {
    tasks {
      id
      title
      completed
    }
  }
`

export class GraphQLTasksRepository implements TasksRepository {
  private readonly client: GraphQLClient

  constructor({
    endpoint = getDefaultEndpoint(),
  }: GraphQLTasksRepositoryOptions = {}) {
    this.client = new GraphQLClient(endpoint)
  }

  async getTasks(): Promise<Task[]> {
    try {
      const data = await this.client.request<TasksQueryResponse>(TasksQuery)

      return data.tasks
    } catch (error) {
      throw mapToRepositoryError(error)
    }
  }
}

function getDefaultEndpoint(): string {
  return new URL('/graphql', window.location.origin).toString()
}
