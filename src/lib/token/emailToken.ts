import jwt from "jsonwebtoken"
import config from "lib/config"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

const verifyOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type EmailToken = string

export interface EmailTokenPayload {
  emailAddress: string
  verificationCode: string
}

export function decodeEmailToken(token: EmailToken): EmailTokenPayload {
  return jwt.verify(token, config.tokenSecret, verifyOptions) as EmailTokenPayload
}

export function generateEmailToken(payload: EmailTokenPayload): EmailToken {
  const options: jwt.SignOptions = {
    expiresIn: "3 hours",
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
