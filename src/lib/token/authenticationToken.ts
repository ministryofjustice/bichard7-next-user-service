import jwt from "jsonwebtoken"
import User from "types/User"
import { Result } from "types/Result"
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
}

export function generateAuthenticationToken(user: User): AuthenticationToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  const payload: AuthenticationTokenPayload = {
    username: user.username,
    exclusionList: user.exclusionList,
    inclusionList: user.inclusionList,
    emailAddress: user.emailAddress,
    groups: user.groups
  }

  return jwt.sign(payload, config.tokenSecret, options)
}

export function decodeAuthenticationToken(token: string): Result<AuthenticationTokenPayload> {
  try {
    return jwt.verify(token, config.tokenSecret, signOptions) as AuthenticationTokenPayload
  } catch (error) {
    return error
  }
}
