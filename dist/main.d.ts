import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

interface IDetaylsTemplateConstructor {
    code: string;
    title: string;
    details: string;
    reference?: string;
}

declare class DetaylsTempĺate {
    code: string;
    title: string;
    details: string;
    reference?: string;
    constructor(params: IDetaylsTemplateConstructor);
}

interface DetaylsErrorConstructor extends IDetaylsTemplateConstructor {
    value?: any;
    keys?: string[];
}

declare class DetaylsError extends DetaylsTempĺate {
    value: any;
    keys: string[];
    constructor(params: DetaylsErrorConstructor);
}

declare class DetaylsResponse {
    status: number;
    errors: DetaylsError[];
    constructor(status: number, errors: DetaylsError[]);
}

interface IValidationOptions {
    details?: string;
    hideValue?: boolean;
    reference?: string;
    keys?: string[];
}

interface DetaylsManagerPushOptions {
    details?: string;
    value?: any;
    keys?: string[];
}

declare class DetaylsManager {
    private httpStatusCode;
    private validatorsQueue;
    private foundErrors;
    constructor(statusCode: number);
    validate(validatorName: string, value: any, options?: IValidationOptions): this;
    run(): Promise<this>;
    push(code: string, options?: DetaylsManagerPushOptions): this;
    throw(): this;
    getResponse(): DetaylsResponse;
    getStatus(): number;
    setStatus(status: number): this;
    getFoundErrors(): DetaylsError[];
    isValid(): boolean;
}

interface IDoneFunction {
    (code?: string): null | DetaylsTempĺate;
}

declare function expressErrorHandler(): (error: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => Response<any>;

declare class Detayls extends DetaylsManager {
}
interface Done extends IDoneFunction {
}
interface ValidationOptions extends IValidationOptions {
}

export { Detayls, DetaylsResponse, Done, ValidationOptions, expressErrorHandler };
