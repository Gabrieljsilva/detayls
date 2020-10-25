import { done } from '../utils/doneFunction'
import { DetaylsError } from './Error'
import { IValidationOptions } from '../interfaces/ValidationOptions'
import { IDetaylsValidatorFNSignature } from '../interfaces/ValidationSignature'

export class DetaylsValidator {
  name: string
  validatorFN: IDetaylsValidatorFNSignature

  constructor(name: string, validatorFN: IDetaylsValidatorFNSignature) {
    this.name = name
    this.validatorFN = validatorFN
  }

  async execute(value: any, options?: IValidationOptions): Promise<null> {
    try {
      await this.validatorFN(value, done)
    } catch (template) {
      if (options) {
        var { hideValue } = options
      }
      throw new DetaylsError({ ...template, ...options, value: hideValue === true ? undefined : value })
    }
    return null
  }
}
