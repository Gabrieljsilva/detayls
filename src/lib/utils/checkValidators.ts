export function checkValidators(validators: {}) {
  if (typeof validators !== 'object') {
    throw new Error(`validators expect an object but receive ${typeof validators}`)
  }

  if (Array.isArray(validators)) {
    throw new Error('validators expect an object but receive an array')
  }

  for (const [key, validator] of Object.entries(validators)) {
    if (typeof validator !== 'function') {
      throw new Error(`validator ${key} expect a function but receive ${typeof validator}`)
    }
  }
}
