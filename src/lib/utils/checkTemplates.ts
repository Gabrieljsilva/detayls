import { DetaylsTempĺate } from '../classes/Template'

export function checkRepeatedTemplateCodes(...templates: DetaylsTempĺate[]) {
  const verifiedTemplates: DetaylsTempĺate[] = []
  for (const template of templates) {
    if (verifiedTemplates.find((verifiedTemplate) => verifiedTemplate.code === template.code)) {
      throw new Error(`repeated codes found: ${template.code}`)
    }
    verifiedTemplates.push(template)
  }
  return null
}

export function checkTemplateAttributesType(...templates: DetaylsTempĺate[]) {
  for (const template of templates) {
    const { code, title, details, reference } = template
    if (typeof code !== 'string') {
      throw new Error(`template expect string on attribute "code" but receive ${typeof code}`)
    }

    if (typeof title !== 'string') {
      throw new Error(`template expect string on attribute "title" but receive ${typeof title}`)
    }

    if (typeof details !== 'string') {
      throw new Error(`template expect string on attribute "details" but receive ${typeof details}`)
    }

    if (reference) {
      if (typeof reference !== 'string') {
        throw new Error(`template expect string on attribute "reference" but receive ${typeof reference}`)
      }
    }
  }
}

export function checkTemplates(...templates: DetaylsTempĺate[]) {
  checkTemplateAttributesType(...templates)
  checkRepeatedTemplateCodes(...templates)
}
