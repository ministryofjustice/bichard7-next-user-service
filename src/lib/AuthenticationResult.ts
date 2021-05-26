import { UserGroup } from "lib/User"

export type Token = string
export type AuthenticationResult = Token | Error

export interface TokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  forenames: string
  surname: string
  emailAddress: string
  groups: UserGroup[]
}

export function isError(result: AuthenticationResult): result is Error {
  return result instanceof Error
}

export function isSuccess(result: AuthenticationResult): result is Token {
  return !isError(result)
}
