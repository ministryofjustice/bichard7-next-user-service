import jwt from "jsonwebtoken"
import { Result } from "types/Result"
import UserFullDetails from "types/UserFullDetails"
import config from "../config"
import UserGroup from "../../types/UserGroup"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type AuthenticationToken = string

export interface AuthenticationTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: UserGroup[]
  id: string
}

export function generateAuthenticationToken(user: Partial<UserFullDetails>, uniqueId: string): AuthenticationToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  const payload: AuthenticationTokenPayload = {
    username: user.username as string,
    exclusionList: user.exclusionList as string[],
    inclusionList: user.inclusionList as string[],
    emailAddress: user.emailAddress as string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    groups: user.groups as UserGroup[],
    id: uniqueId
  }

  return jwt.sign(payload, config.tokenSecret, options)
}

export function decodeAuthenticationToken(token: string): Result<AuthenticationTokenPayload> {
  try {
    return jwt.verify(token, config.tokenSecret, signOptions) as AuthenticationTokenPayload
  } catch (error) {
    return error as Error
  }
}
