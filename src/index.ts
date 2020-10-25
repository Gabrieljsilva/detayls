import { DetaylsManager } from './lib/classes/Manager'
import { IDoneFunction } from './lib/interfaces/Done'
import { IValidationOptions } from './lib/interfaces/ValidationOptions'

export { expressErrorHandler } from './lib/thirt-party/express/errorHandler'
export { DetaylsResponse } from './lib/classes/Response'

export class Detayls extends DetaylsManager {}
export interface Done extends IDoneFunction {}
export interface ValidationOptions extends IValidationOptions {}
