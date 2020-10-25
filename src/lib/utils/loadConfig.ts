import path from 'path'
import { normalizePath } from './normalizePath'
import { Config } from '../classes/Config'

export function loadConfig(configBasePath: string, allowedExtensions: string[]) {
  const defaultTemplatesPath = path.resolve(process.cwd(), 'templates.json')
  const defaultValidatorsPath = path.resolve(process.cwd(), 'validators.js')
  for (const extension of allowedExtensions) {
    try {
      const fullConfigPath = path.resolve(configBasePath + extension)
      const { templatesPath, validatorsPath } = require(fullConfigPath)
      const config = new Config(
        templatesPath ? normalizePath(templatesPath) : defaultTemplatesPath,
        validatorsPath ? normalizePath(validatorsPath) : defaultValidatorsPath
      )
      return config
    } catch {
      continue
    }
  }
  return new Config(defaultTemplatesPath, defaultValidatorsPath)
}

const ROOT_DIR = process.cwd()
const CONFIG_FILE_NAME = 'detayls.config'
const ALLOWED_CONFIG_EXTENSIONS = ['.ts', '.js', '.json']

export const config = loadConfig(path.resolve(ROOT_DIR, CONFIG_FILE_NAME), ALLOWED_CONFIG_EXTENSIONS)
