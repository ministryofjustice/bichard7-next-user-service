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
  try {
    return jwt.verify(token, config.tokenSecret, verifyOptions) as EmailTokenPayload
  } catch (error) {
    return error
  }
}

export function generateEmailToken(payload: EmailTokenPayload): EmailToken {
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
