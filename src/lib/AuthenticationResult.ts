import { User } from "./User"

export type AuthenticationResult = User | Error

export function isError(result: AuthenticationResult): result is Error {
  return result instanceof Error
}

export function isSuccess(result: AuthenticationResult): result is User {
  return !isError(result)
}
