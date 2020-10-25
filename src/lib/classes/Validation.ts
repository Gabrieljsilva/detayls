import { DetaylsValidator } from './Validator'
import { IValidationOptions } from '../interfaces/ValidationOptions'

export class DetaylsValidation {
  validator: DetaylsValidator
  value: any
  executionOptions?: IValidationOptions

  constructor(validator: DetaylsValidator, value: any, options?: IValidationOptions) {
    this.validator = validator
    this.value = value
    this.executionOptions = options
  }
}
