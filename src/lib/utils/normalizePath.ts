import path from 'path'

/**
 * @function normalizePath Verify if a given path is relative and normalize it
 * @param unnormalizedPath A string containing any string to be normalized
 */

export function normalizePath(unnormalizedPath: string) {
  const pathIsAbsolute = path.isAbsolute(unnormalizedPath)

  if (pathIsAbsolute) {
    return path.normalize(unnormalizedPath)
  } else {
    const normalizedPath = path.resolve(process.cwd(), unnormalizedPath)
    return normalizedPath
  }
}
