import { config } from './loadConfig'
import { DetaylsValidatorsManager } from '../classes/ValidatorsManager'
import { DetaylsValidator } from '../classes/Validator'
import { checkValidators } from './checkValidators'
import { IDetaylsValidatorFNSignature } from '../interfaces/ValidationSignature'

export function loadValidators(validatorsPath: string) {
  const validators = require(validatorsPath)
  checkValidators(validators)
  const listOfValidators = Object.entries(validators).map(
    ([key, FN]: [string, IDetaylsValidatorFNSignature]) => new DetaylsValidator(key, FN)
  )
  return new DetaylsValidatorsManager(listOfValidators)
}

export const validators = loadValidators(config.validatorsPath)
