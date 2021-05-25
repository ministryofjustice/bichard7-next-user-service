export interface UserCredentials {
  emailAddress: string
  password: string
}

export interface User {
  emailAddress: string
}

export type AuthenticationResult = User | Error

export function isError(result: AuthenticationResult): result is Error {
  return result instanceof Error
}

export function isSuccess(result: AuthenticationResult): result is User {
  return !isError(result)
}
