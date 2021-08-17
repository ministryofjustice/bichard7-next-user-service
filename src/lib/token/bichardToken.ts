import jwt from "jsonwebtoken"
import User from "types/User"
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
  emailAddress: string
  groups: UserGroup[]
}

export function generateBichardToken(user: User): BichardToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  const payload: BichardTokenPayload = {
    username: user.username,
    exclusionList: user.exclusionList,
    inclusionList: user.inclusionList,
    emailAddress: user.emailAddress,
    groups: user.groups
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
