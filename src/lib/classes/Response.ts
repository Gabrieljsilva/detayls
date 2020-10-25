import { DetaylsError } from './Error'

export class DetaylsResponse {
  status: number
  errors: DetaylsError[]

  constructor(status: number, errors: DetaylsError[]) {
    this.status = status
    this.errors = errors
  }
}
