import jwt from "jsonwebtoken"
import config from "lib/config"
import { UserGroup } from "lib/User"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type Token = string

export interface BichardTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  forenames: string
  surname: string
  emailAddress: string
  groups: UserGroup[]
}

export interface EmailTokenPayload {
  emailAddress: string
  verificationCode: string
}

export function generateBichardToken(payload: BichardTokenPayload): Token {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}

export function generateEmailToken(payload: EmailTokenPayload): Token {
  const options: jwt.SignOptions = {
    expiresIn: "3 hours",
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
