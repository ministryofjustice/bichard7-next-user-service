import { Token } from "lib/Token"

export type AuthenticationResult = Token | Error

export function isError(result: AuthenticationResult): result is Error {
  return result instanceof Error
}

export function isSuccess(result: AuthenticationResult): result is Token {
  return !isError(result)
}
