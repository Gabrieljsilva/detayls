import { templates } from './loadTemplates'
import { IDoneFunction } from '../interfaces/Done'

export const done: IDoneFunction = (code?: string) => {
  if (!code) {
    return null
  }
  throw templates.findTemplateByCode(code)
}
