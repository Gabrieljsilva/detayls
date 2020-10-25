import { DetaylsValidator } from './Validator'

export class DetaylsValidatorsManager {
  validators: DetaylsValidator[]
  constructor(validators: DetaylsValidator[]) {
    this.validators = validators
  }

  findValidatorByName(name: string) {
    return this.validators.find((validator) => validator.name === name)
  }
}
