import { IDetaylsTemplateConstructor } from '../interfaces/DetaylsTemplateConstructor'

export class DetaylsTempĺate {
  code: string
  title: string
  details: string
  reference?: string

  constructor(params: IDetaylsTemplateConstructor) {
    const { code, title, details, reference } = params
    this.code = code
    this.title = title
    this.details = details
    this.reference = reference
  }
}
