import { DetaylsTempĺate } from './Template'
import { DetaylsErrorConstructor } from '../interfaces/DetaylsErrorConstructor'

export class DetaylsError extends DetaylsTempĺate {
  value: any
  keys: string[]
  constructor(params: DetaylsErrorConstructor) {
    const { code, title, details, reference, value, keys } = params
    super({ code, title, details, reference })
    this.value = value
    this.keys = keys
  }
}
