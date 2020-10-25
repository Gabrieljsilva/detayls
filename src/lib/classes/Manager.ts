import { DetaylsError } from './Error'
import { DetaylsValidation } from './Validation'
import { DetaylsResponse } from './Response'
import { validators } from '../utils/loadValidators'
import { templates } from '../utils/loadTemplates'
import { IValidationOptions } from '../interfaces/ValidationOptions'
import { DetaylsManagerPushOptions } from '../interfaces/DetaylsManagerPushOptions'

export class DetaylsManager {
  private httpStatusCode: number
  private validatorsQueue: DetaylsValidation[] = []
  private foundErrors: DetaylsError[] = []

  constructor(statusCode: number) {
    this.httpStatusCode = statusCode
  }

  validate(validatorName: string, value: any, options?: IValidationOptions) {
    const validator = validators.findValidatorByName(validatorName)
    if (!validator) {
      throw new Error(`cannot find validator ${validatorName}`)
    }
    this.validatorsQueue.push(new DetaylsValidation(validator, value, options))
    return this
  }

  async run() {
    while (this.validatorsQueue.length > 0) {
      const { validator, value, executionOptions } = this.validatorsQueue.shift()
      try {
        await validator.execute(value, executionOptions)
      } catch (error) {
        this.foundErrors.push(error)
      }
    }
    return this.throw()
  }

  push(code: string, options: DetaylsManagerPushOptions = {}) {
    const template = templates.findTemplateByCode(code)
    if (!template) {
      throw new Error(`cannot find template with code: ${code}`)
    }
    this.foundErrors.push(new DetaylsError({ ...template, ...options }))
    return this
  }

  throw() {
    if (this.foundErrors.length > 0) {
      throw this.getResponse()
    }
    return this
  }

  getResponse() {
    return new DetaylsResponse(this.httpStatusCode, this.foundErrors)
  }

  getStatus() {
    return this.httpStatusCode
  }

  setStatus(status: number) {
    this.httpStatusCode = status
    return this
  }

  getFoundErrors() {
    return this.foundErrors
  }

  isValid() {
    return this.foundErrors.length === 0
  }
}
