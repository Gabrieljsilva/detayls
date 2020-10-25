import { IDetaylsTemplateConstructor } from './DetaylsTemplateConstructor'

export interface DetaylsErrorConstructor extends IDetaylsTemplateConstructor {
  value?: any
  keys?: string[]
}
