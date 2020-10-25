import { config } from './loadConfig'
import { DetaylsTemplatesManager } from '../classes/TemplatesManager'
import { checkTemplates } from './checkTemplates'

export function loadTemplates(templatesPath: string) {
  const { default: defaultTemplate, templates } = require(templatesPath)

  if (!defaultTemplate) {
    throw new Error('default template not provided')
  }

  if (Array.isArray(defaultTemplate)) {
    throw new Error('default template expect an object but receive an array')
  }

  if (typeof defaultTemplate !== 'object') {
    throw new Error(`default template expect an object but receive ${typeof defaultTemplate}`)
  }

  if (!Array.isArray(templates)) {
    throw new Error(`templates expect an array but receive ${typeof templates}`)
  }

  checkTemplates(defaultTemplate, ...templates)
  return new DetaylsTemplatesManager(defaultTemplate, templates)
}

export const templates = loadTemplates(config.templatesPath)
