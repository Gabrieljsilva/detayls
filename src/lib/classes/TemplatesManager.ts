import { DetaylsTempĺate } from './Template'
import { checkTemplates } from '../utils/checkTemplates'

export class DetaylsTemplatesManager {
  default: DetaylsTempĺate
  templates: DetaylsTempĺate[]

  constructor(defaultTemplate: DetaylsTempĺate, templates: DetaylsTempĺate[]) {
    checkTemplates(...templates, defaultTemplate)
    this.default = defaultTemplate
    this.templates = templates
  }

  findTemplateByCode(code: string) {
    return this.default.code === code ? this.default : this.templates.find((template) => template.code === code)
  }
}
