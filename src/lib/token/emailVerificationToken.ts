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
  try {
    return jwt.verify(token, config.tokenSecret, verifyOptions) as EmailVerificationTokenPayload
  } catch (error) {
    return error
  }
}

export function generateEmailVerificationToken(payload: EmailVerificationTokenPayload): EmailVerificationToken {
  const options: jwt.SignOptions = {
    expiresIn: `${config.emailVerificationExpiresIn} minutes`,
    ...signOptions
  }

  try {
    return jwt.sign(payload, config.tokenSecret, options)
  } catch (error) {
    return error
  }
}
