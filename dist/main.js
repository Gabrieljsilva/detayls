'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class DetaylsTempĺate {
    constructor(params) {
        const { code, title, details, reference } = params;
        this.code = code;
        this.title = title;
        this.details = details;
        this.reference = reference;
    }
}

class DetaylsError extends DetaylsTempĺate {
    constructor(params) {
        const { code, title, details, reference, value, keys } = params;
        super({ code, title, details, reference });
        this.value = value;
        this.keys = keys;
    }
}

class DetaylsValidation {
    constructor(validator, value, options) {
        this.validator = validator;
        this.value = value;
        this.executionOptions = options;
    }
}

class DetaylsResponse {
    constructor(status, errors) {
        this.status = status;
        this.errors = errors;
    }
}

/**
 * @function normalizePath Verify if a given path is relative and normalize it
 * @param unnormalizedPath A string containing any string to be normalized
 */
function normalizePath(unnormalizedPath) {
    const pathIsAbsolute = path__default['default'].isAbsolute(unnormalizedPath);
    if (pathIsAbsolute) {
        return path__default['default'].normalize(unnormalizedPath);
    }
    else {
        const normalizedPath = path__default['default'].resolve(process.cwd(), unnormalizedPath);
        return normalizedPath;
    }
}

class Config {
    constructor(templatesPath, validatorsPath) {
        this.templatesPath = templatesPath;
        this.validatorsPath = validatorsPath;
    }
}

function loadConfig(configBasePath, allowedExtensions) {
    const defaultTemplatesPath = path__default['default'].resolve(process.cwd(), 'templates.json');
    const defaultValidatorsPath = path__default['default'].resolve(process.cwd(), 'validators.js');
    for (const extension of allowedExtensions) {
        try {
            const fullConfigPath = path__default['default'].resolve(configBasePath + extension);
            const { templatesPath, validatorsPath } = require(fullConfigPath);
            const config = new Config(templatesPath ? normalizePath(templatesPath) : defaultTemplatesPath, validatorsPath ? normalizePath(validatorsPath) : defaultValidatorsPath);
            return config;
        }
        catch (_a) {
            continue;
        }
    }
    return new Config(defaultTemplatesPath, defaultValidatorsPath);
}
const ROOT_DIR = process.cwd();
const CONFIG_FILE_NAME = 'detayls.config';
const ALLOWED_CONFIG_EXTENSIONS = ['.ts', '.js', '.json'];
const config = loadConfig(path__default['default'].resolve(ROOT_DIR, CONFIG_FILE_NAME), ALLOWED_CONFIG_EXTENSIONS);

class DetaylsValidatorsManager {
    constructor(validators) {
        this.validators = validators;
    }
    findValidatorByName(name) {
        return this.validators.find((validator) => validator.name === name);
    }
}

function checkRepeatedTemplateCodes(...templates) {
    const verifiedTemplates = [];
    for (const template of templates) {
        if (verifiedTemplates.find((verifiedTemplate) => verifiedTemplate.code === template.code)) {
            throw new Error(`repeated codes found: ${template.code}`);
        }
        verifiedTemplates.push(template);
    }
    return null;
}
function checkTemplateAttributesType(...templates) {
    for (const template of templates) {
        const { code, title, details, reference } = template;
        if (typeof code !== 'string') {
            throw new Error(`template expect string on attribute "code" but receive ${typeof code}`);
        }
        if (typeof title !== 'string') {
            throw new Error(`template expect string on attribute "title" but receive ${typeof title}`);
        }
        if (typeof details !== 'string') {
            throw new Error(`template expect string on attribute "details" but receive ${typeof details}`);
        }
        if (reference) {
            if (typeof reference !== 'string') {
                throw new Error(`template expect string on attribute "reference" but receive ${typeof reference}`);
            }
        }
    }
}
function checkTemplates(...templates) {
    checkTemplateAttributesType(...templates);
    checkRepeatedTemplateCodes(...templates);
}

class DetaylsTemplatesManager {
    constructor(defaultTemplate, templates) {
        checkTemplates(...templates, defaultTemplate);
        this.default = defaultTemplate;
        this.templates = templates;
    }
    findTemplateByCode(code) {
        return this.default.code === code ? this.default : this.templates.find((template) => template.code === code);
    }
}

function loadTemplates(templatesPath) {
    const { default: defaultTemplate, templates } = require(templatesPath);
    if (!defaultTemplate) {
        throw new Error('default template not provided');
    }
    if (Array.isArray(defaultTemplate)) {
        throw new Error('default template expect an object but receive an array');
    }
    if (typeof defaultTemplate !== 'object') {
        throw new Error(`default template expect an object but receive ${typeof defaultTemplate}`);
    }
    if (!Array.isArray(templates)) {
        throw new Error(`templates expect an array but receive ${typeof templates}`);
    }
    checkTemplates(defaultTemplate, ...templates);
    return new DetaylsTemplatesManager(defaultTemplate, templates);
}
const templates = loadTemplates(config.templatesPath);

const done = (code) => {
    if (!code) {
        return null;
    }
    throw templates.findTemplateByCode(code);
};

class DetaylsValidator {
    constructor(name, validatorFN) {
        this.name = name;
        this.validatorFN = validatorFN;
    }
    execute(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validatorFN(value, done);
            }
            catch (template) {
                if (options) {
                    var { hideValue } = options;
                }
                throw new DetaylsError(Object.assign(Object.assign(Object.assign({}, template), options), { value: hideValue === true ? undefined : value }));
            }
            return null;
        });
    }
}

function checkValidators(validators) {
    if (typeof validators !== 'object') {
        throw new Error(`validators expect an object but receive ${typeof validators}`);
    }
    if (Array.isArray(validators)) {
        throw new Error('validators expect an object but receive an array');
    }
    for (const [key, validator] of Object.entries(validators)) {
        if (typeof validator !== 'function') {
            throw new Error(`validator ${key} expect a function but receive ${typeof validator}`);
        }
    }
}

function loadValidators(validatorsPath) {
    const validators = require(validatorsPath);
    checkValidators(validators);
    const listOfValidators = Object.entries(validators).map(([key, FN]) => new DetaylsValidator(key, FN));
    return new DetaylsValidatorsManager(listOfValidators);
}
const validators = loadValidators(config.validatorsPath);

class DetaylsManager {
    constructor(statusCode) {
        this.validatorsQueue = [];
        this.foundErrors = [];
        this.httpStatusCode = statusCode;
    }
    validate(validatorName, value, options) {
        const validator = validators.findValidatorByName(validatorName);
        if (!validator) {
            throw new Error(`cannot find validator ${validatorName}`);
        }
        this.validatorsQueue.push(new DetaylsValidation(validator, value, options));
        return this;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.validatorsQueue.length > 0) {
                const { validator, value, executionOptions } = this.validatorsQueue.shift();
                try {
                    yield validator.execute(value, executionOptions);
                }
                catch (error) {
                    this.foundErrors.push(error);
                }
            }
            return this.throw();
        });
    }
    push(code, options = {}) {
        const template = templates.findTemplateByCode(code);
        if (!template) {
            throw new Error(`cannot find template with code: ${code}`);
        }
        this.foundErrors.push(new DetaylsError(Object.assign(Object.assign({}, template), options)));
        return this;
    }
    throw() {
        if (this.foundErrors.length > 0) {
            throw this.getResponse();
        }
        return this;
    }
    getResponse() {
        return new DetaylsResponse(this.httpStatusCode, this.foundErrors);
    }
    getStatus() {
        return this.httpStatusCode;
    }
    setStatus(status) {
        this.httpStatusCode = status;
        return this;
    }
    getFoundErrors() {
        return this.foundErrors;
    }
    isValid() {
        return this.foundErrors.length === 0;
    }
}

function expressErrorHandler() {
    return (error, request, response, next) => {
        if (error instanceof DetaylsResponse) {
            return response.status(error.status).json(error);
        }
        const defaultError = new DetaylsResponse(500, [new DetaylsError(templates.default)]);
        return response.status(defaultError.status).json(defaultError);
    };
}

class Detayls extends DetaylsManager {
}

exports.Detayls = Detayls;
exports.DetaylsResponse = DetaylsResponse;
exports.expressErrorHandler = expressErrorHandler;
