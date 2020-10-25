import { Request, Response, ErrorRequestHandler, NextFunction } from 'express'
import { DetaylsResponse } from '../../classes/Response'
import { templates } from '../../utils/loadTemplates'
import { DetaylsError } from '../../classes/Error'

export function expressErrorHandler() {
  return (error: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof DetaylsResponse) {
      return response.status(error.status).json(error)
    }

    const defaultError = new DetaylsResponse(500, [new DetaylsError(templates.default)])

    return response.status(defaultError.status).json(defaultError)
  }
}
