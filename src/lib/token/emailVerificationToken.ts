import jwt from "jsonwebtoken"
import config from "lib/config"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

const verifyOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type EmailVerificationToken = string

export interface EmailVerificationTokenPayload {
  emailAddress: string
  verificationCode: string
}

export function decodeEmailVerificationToken(token: EmailVerificationToken): EmailVerificationTokenPayload {
  return jwt.verify(token, config.tokenSecret, verifyOptions) as EmailVerificationTokenPayload
}

export function generateEmailVerificationToken(payload: EmailVerificationTokenPayload): EmailVerificationToken {
  const options: jwt.SignOptions = {
    expiresIn: `${config.emailVerificationExpiresIn} minutes`,
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
