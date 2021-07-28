import { BichardToken } from "lib/token/bichardToken"

export type AuthenticationResult = BichardToken | Error

export function isError(result: AuthenticationResult): result is Error {
  return result instanceof Error
}

export function isSuccess(result: AuthenticationResult): result is BichardToken {
  return !isError(result)
}
