import jwt from "jsonwebtoken"
import config from "../config"
import UserGroup from "../../types/UserGroup"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type BichardToken = string

export interface BichardTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  forenames: string
  surname: string
  emailAddress: string
  groups: UserGroup[]
}

export function generateBichardToken(payload: BichardTokenPayload): BichardToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
