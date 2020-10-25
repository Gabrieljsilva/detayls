import { IDoneFunction } from './Done'
import { DetaylsTempĺate } from '../classes/Template'

export interface IDetaylsValidatorFNSignature {
  (value: string, done: IDoneFunction): Promise<null | DetaylsTempĺate> | null | DetaylsTempĺate
}
