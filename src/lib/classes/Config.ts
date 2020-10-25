export class Config {
  templatesPath: string
  validatorsPath: string

  constructor(templatesPath: string, validatorsPath: string) {
    this.templatesPath = templatesPath
    this.validatorsPath = validatorsPath
  }
}
