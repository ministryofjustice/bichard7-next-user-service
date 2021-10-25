import jwt from "jsonwebtoken"
import { Result } from "types/Result"
import config from "../config"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type TimeoutToken = string

export interface TimeoutTokenPayload {
  username: string
  dateOfCreation: Date
  id: string
}

export function generateTimeoutToken(username: string, uniqueId: string): TimeoutToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  const payload: TimeoutTokenPayload = {
    username,
    dateOfCreation: new Date(),
    id: uniqueId
  }

  return jwt.sign(payload, config.tokenSecret, options)
}

export function decodeTimeoutToken(token: string): Result<TimeoutTokenPayload> {
  try {
    return jwt.verify(token, config.tokenSecret, signOptions) as TimeoutTokenPayload
  } catch (error) {
    return error as Error
  }
}
