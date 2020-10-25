# Detayls

Detayls is a small package for data validation and standardization of error messages in REST APIs.

## Installation

Use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install the package on your project:

```bash
npm install detayls
```
or
```bash
yarn add detayls
```

## Usage

```js
const { Detayls } = require("detayls")

async function main(){
    try {
        await new Detayls(400)
            .validate('name', 'Gabriel Silva', { keys: ['user', 'name'] })
            .run()
    } catch (error) {
        // Treat the error the way you want
    }
}
main()
```
Before executing the above code make sure to configure your validation file and your error template file accordingly, see more about this in the [settings](#settings) topic

## Settings
By default Detayls will look for the “templates.json” file for the error templates and “validators.js” for the validation file at the root of the project.
It is possible to customize the directory, name and extension of these files, for that, create a file called “detayls.config.json” or “detayls.config.js” or “detayls.config.ts” and export the following variables:

|      name      |  type  |      default     |                 description                 |
|:--------------:|:------:|:----------------:|:-------------------------------------------:|
| validatorsPath | string |  ./validators.js |          Validation file location           |
|  templatesPath | string | ./templates.json |        error templates file location        |


Note: Use the "module.exports" command on both CommonJs and ES6 Modules to export the settings. It is possible to use relative or absolute paths to indicate files.

```detayls.config.js```

```javascript
module.exports = {
    validatorsPath: "./customValidatorsFile.js",
    templatesPath: "./customTemplatesFile.js"
}
```


### Error templates

An error template must be an object that contains certain attributes to describe a recurring and generic error that can occur during the processing of a request in your API.
Each error template must follow the following format:

|    name   |  type  | required |                                description                               |
|:---------:|:------:|:--------:|:------------------------------------------------------------------------:|
|    code   | string |   true   |                must be a unique code to identify the error               |
|   title   | string |   true   |                should be a short description of the error                |
|  details  | string |   true   | must be a detailed description of the error (can be changed at run time) |
| reference | string |   false  |  must be a url pointing to some documentation with details of the error  |

The error template file must export two attributes:

- <b> default: </b> A standard error template that should be used when the system is unable to accurately identify the error that occurred (ex error 500 of the http protocol);
- <b> templates: </b> An array of errors that will be used to assemble more detailed error responses.

Example:

```templates.js```

```js
module.exports = {
    default: {
        code: "9000",
        title: "Internal Server Error",
        details: "this error occurs when the server was unable to identify the problem during the processing of the request",
        reference: "/api/v1/reference/errors/9000"
    },

    templates: [
        {
            code: "1000",
            title: "invalid data",
            details: "this error occurs when the client sends invalid or badly formatted information",
            reference: "/api/v1/reference/errors/1000"
        }
    ]
}
```

Note: The non-declaration of these attributes will result in an error.

### Validators

Validators are functions that determine whether certain data is valid or not. Each validator must validate the smallest unit of information possible within the general context of the application (example: email, password, etc ...). Avoid trying to use validators to validate entire forms, as this will limit the use of your validator.

Each validator receives two mandatory parameters:
- The information to be validated;
- A function to indicate the end of the validation process;

example of a validation file:

```validators.js```

```js
module.exports = {
    name(name, done){
        if(name.length < 3){
            return done('1000')
        }
        return done()
    }
}
```
In the code above we are validating a name, and the rule for validation is: A name is only valid if it is at least 3 characters long.

It is important to pay attention to a detail: when we want to tell the validator that certain data is invalid, we use the "done" function, passing as parameter the error code declared in our [error templates file](#error-templates). To tell the validator that the data is valid, you do not need to pass any value but if you prefer you can pass the value "null".

If you are using Typescript, you can import the "Done" interface from the Detayls module to add the typing.

### The Detayls class
Now that we've seen the error templates and validators, let's talk about the Detayls class. Through instances of this class, we can manage errors and perform validations.

When instantiating an object of the Detayls class, we must pass as a parameter the http status code that will be sent to the client, in case of any validation error or if the error is added manually.

```js
const { Detayls } = require("detayls")

const validation  = new Detayls(400)
```

As stated earlier, this instance will manage the error templates and perform validations, for that we have some methods that will help us in this process:
- validate
- run
- push
- throw
- getResponse
- getStatus
- setStatus
- getFoundErrors
- isValid

#### validate
The "validate" method will add a validation to the execution queue. It receives as a first parameter a string with the name of the validator function (yes, those we declared in [validation file](#validators)), the second parameter is the data to be validated, the third and last parameter is optional and it must be an options object to customize some attributes of the error object if the given data is invalid.

example:

```js
const { Detayls } = require("detayls")
new Detayls(400)
    .validate("name", "Gabriel Silva")
```

The validate method returns the instance itself, this means that we can execute this method in a chain to add several validations at once.

```js
const { Detayls } = require("detayls")
new Detayls(400)
    .validate("name", "Gabriel Silva")
    .validate("email", "gabriel@email.com")
```

Okay, what about customizing the error attributes? In this regard we have the following options:

|    name   |       type      |        default       |                                description                               |
|:---------:|:---------------:|:--------------------:|:------------------------------------------------------------------------:|
|  details  |      string     | *defined on template | must be a detailed description of the error (can be changed at run time) |
| reference |      string     | *defined on template |  must be a url pointing to some documentation with details of the error  |
| hideValue |     boolean     |         false        |        an indicative to hide the validation value in the response        |
|    keys   | array of string |         null         |    must be an array of string for data identification (ex: form field)   |

```js
const { Detayls } = require("detayls")
new Detayls(400)
    .validate("name", "Gabriel Silva", { keys: ["user", "name"] })
    .validate("email", "gabriel@email.com", { keys: ["user", "email"] })
```

#### run

The "validate" method alone will not perform the validations, to do this we will use the "run" method. It is worth remembering that the execution of the "run" method is asynchronous, that is, its return will always be a promise. It is interesting that the try / catch syntax is used to perform the validations and to handle the errors returned from the validations.

```js
const { Detayls } = require("detayls")

async function main(){
    try {
        await new Detayls(400)
            .validate("name", "Gabriel Silva")
            .run()
    } catch (error) {
        // Treat the error the way you want
    }
}

main()
```

Since the "run" method returns a promise, if the validation process fails, an instance of the "DetaylsResponse" class will be rejected. This class will have the errors found and also the http status code that was defined when instantiating an object of the Detayls class.


#### push

The "push" method will manually add an error to the Detayls instance. This method takes two parameters, the first must be the error code that was declared in the [templates file](#error-templates) and the second argument is optional and must be an object with attributes to customize the final error.

```js
const { Detayls } = require("detayls")
new Detayls(400)
    .push('1000', { keys: ['user', 'name'], value: "some invalid name" })
```

Below are the attributes you can add in the "options" parameter:

|   name  |       type      |        default       |                                description                               |
|:-------:|:---------------:|:--------------------:|:------------------------------------------------------------------------:|
| details |      string     | *defined on template | must be a detailed description of the error (can be changed at run time) |
|  value  |       any       |         null         |                   any value that was considered invalid                  |
|   keys  | array of string |         null         |    must be an array of string for data identification (ex: form field)   |

The "push" method also returns the Detayls instance itself, so you can chain multiple calls to this method to add multiple errors at once.

```js
const { Detayls } = require("detayls")
new Detayls(400)
    .push('1000', { keys: ['user', 'name'], value: "some invalid name" })
    .push('1000', { keys: ['user', 'email'], value: "some invalid email" })
```

#### throw

Just as the "validate" method does not perform validations, the "push" method does not throw errors, for this we will need to use the "throw" method, this method will check if there is an error within the Detayls instance, if any, error will be thrown. The "throw" method is synchronous, so it does not return a promise like the "run" method. Internally it uses the "throw" command itself to throw errors that can be handled using try/catch syntax.

```js
const { Detayls } = require("detayls")
try {
    new Detayls(400)
        .push('1000', { keys: ['user', 'name'], value: "some invalid name" })
        .push('1000', { keys: ['user', 'email'], value: "some invalid email" })
        .throw()
} catch(error){
    // Treat the error the way you want
}
```

#### getResponse

We will not always use the try/catch syntax after using the "push" method so we can use the "getResponse" method to obtain the error object of the Detayls instance.

```js
const { Detayls } = require("detayls")
const error = new Detayls(400)
    .push('1000', { keys: ['user', 'name'], value: "some invalid name" })
    .push('1000', { keys: ['user', 'email'], value: "some invalid email" })
    .getResponse()
// Treat the error the way you want
```

#### getStatus
This method returns the current status code for a Detayls instance:

```js
const { Detayls } = require("detayls")
const statusCode = new Detayls(400).getStatus()
```

#### setStatus
This method replaces the status code of a Detayls instance. It receives a number as a parameter and returns the instance itself.

```js
const { Detayls } = require("detayls")
new Detayls(400).setStatus(404)
```

#### getFoundErrors
This method returns an array with only the errors found from a Detayls instance.

```js
const { Detayls } = require("detayls")
const errors = new Detayls(400)
    .push('1000', { keys: ['user', 'name'], value: "some invalid name" })
    .push('1000', { keys: ['user', 'email'], value: "some invalid email" })
    .getFoundErrors()
```


#### isValid
Returns a boolean to determine if there is an error in a Detayls instance.


```js
const { Detayls } = require("detayls")
new Detayls(400)
    .push('1000', { keys: ['user', 'name'], value: "some invalid name" })
    .isValid() // returns false because there is an error

new Detayls(400)
    .isValid() // returns true because there are no errors
```

## Good habits

### Do not create very specific error templates
I created generic error templates that can be applied in different ways within the same context.
Example:

```js
module.exports = {
    default: {
        code: "9000",
        title: "Internal Server Error",
        details: "this error occurs when the server was unable to identify the problem while processing the request,
        reference: "/api/v1/reference/errors/9000"
    },

    templates: [
        {
            code: "1000",
            title: "invalid data",
            details: "this error occurs when the client sends invalid or badly formatted information",
            reference: "/api/v1/reference/errors/1000"
        }
    ]
}
```

Note that the "1000" code errors are inserted in a context, which is the form submission. This template only says that certain data is invalid, but does not reveal details of the validation process or business rule. This is a great example of an error template, as it can be reused in various types of situations where we need to validate user data.

Below is an example of an error template that should be avoided:

```js
module.exports = {
    default: {
        code: "9000",
        title: "Internal Server Error",
        details: "this error occurs when the server was unable to identify the problem during the processing of the request",
        reference: "/api/v1/reference/errors/9000"
    },

    templates: [
        {
            code: "1001",
            title: "invalid registration form",
            details: "this error occurs when the client sends invalid or badly formatted information",
            reference: "/api/v1/reference/errors/1001"
        }
    ]
}
```
The template above code "1001" should be avoided, because, although it is still part of a form submission context, it points to a very specific form, you will hardly be able to reuse it for other situations.

### Group your error codes
Error codes are really useful for performing client-side checks. Often you will come across error templates that, although different, relate to the same feature of an API (authentication, submission of forms, etc.). It is interesting that these errors are grouped in predetermined ranges, so you have a list of templates with codes that are coherent with each other.

Example:

|    range    |                  description                  |
|:-----------:|:---------------------------------------------:|
|     9000    |             Internal server error             |
| 1000 ~ 1099 |                Forms Validation               |
| 1100 ~ 1199 |        Media processing and validation        |
| 1200 ~ 1300 |      Validation errors outside the server     |
| 2000 ~ 2099 |                API route errors               |
| 2100 ~ 2199 | CRUD errors (create, retrieve, update delete) |
| 3000 ~ 3099 |             Authentication errors             |
| 4000 ~ 4099 |               Permission errors               |

example taken from our list of templates, [available for you to use in your projects here](https://github.com/Gabrieljsilva/detayls/tree/main/templates).

### Do not create validators to validate too much data at once
It is interesting that you validate the smallest possible data units. A great example is to create a validator for each data in a form and not a validator to validate entire forms.

Do it:

```validators.js``` 
```js 
module.exports = {
    name(name, done){
        //logic to validate name
    },
    email(email, done){
        //logic to validate email
    },
    password(password, done){
        //logic to validate password
    }
}
```

Avoid this:
```validators.js``` 
```js 
module.exports = {
    user(user, done){
        const { name, email, password } = user
        //logic to validate name
        //logic to validate email
        //logic to validate password
    }
}
```

## Example with Express
In this example we will create an application with express and Detayls.

install the dependencies:
```npm install express detayls"```

```js
const express = require('express')
const { Detayls, expressErrorHandler } = require('detayls')

const app = express()

// setup your middlewares here
app.use(express.json())

// setup your routes here
app.get('/', (req, res) => {
    return res.send("hello world")
})

app.post('/user', async (req, res) => {
    try {
        await new Detayls(400)
            .validate('name', req.body.name, { keys: ['user', 'name'] })
            .validate('email', req.body.email, { keys: ['user', 'email'] })
            .validate('password', req.body.password, { keys: ['user', 'password'] })
            .run()

        // Logic to create user
        return res.send('user created')
    } catch (error){
        return next(error)
    }
})

// setup your error handles here
app.use(expressErrorHandler())

app.listen(3333, () => console.log('starting server on http://localhost:3333'))
```
Then add the validator file and the template file, as described below:

```validators.js```

```js
module.exports = {
    name(name, done){
        if(name.length < 3){
            return done('1000')
        }
        return done(null)
    },
    email(email, done){
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if(!regex.test(email)){
            return done('1000')
        }
        return done(null)
    },
    password(password, done){
        if(password.length < 3){
            return done('1000')
        }
        return done(null)
    }
}
```

```templates.json```

```json
{
    "default": {
        "code": "9000",
        "title": "Internal Server Error",
        "details": "this error occurs when the server was unable to identify the problem during the processing of the request",
        "reference": "/api/v1/reference/errors/9000"
    },

    "templates": [
        {
            "code": "1000",
            "title": "invalid data",
            "details": "this error occurs when the client sends invalid or badly formatted information",
            "reference": "/api/v1/reference/errors/1000"
        }
    ]
}
```

## Resources to add
- Throw an error immediately when a validation fails.
- Customize error in the "done" function within the validators.
- Request logs in express middleware.
- Tests with Jest

## Contribute
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
