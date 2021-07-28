import jwt from "jsonwebtoken"
import config from "lib/config"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type EmailToken = string

export interface EmailTokenPayload {
  emailAddress: string
  verificationCode: string
}

export function generateEmailToken(payload: EmailTokenPayload): EmailToken {
  const options: jwt.SignOptions = {
    expiresIn: "3 hours",
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
