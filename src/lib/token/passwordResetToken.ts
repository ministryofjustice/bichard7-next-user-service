import jwt from "jsonwebtoken"
import config from "lib/config"
import { Result } from "types/Result"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

const verifyOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export interface PasswordResetTokenPayload {
  emailAddress: string
  passwordResetCode: string
}

export function decodePasswordResetToken(token: string): Result<PasswordResetTokenPayload> {
  try {
    return jwt.verify(token, config.tokenSecret, verifyOptions) as PasswordResetTokenPayload
  } catch (error) {
    return error
  }
}

export function generatePasswordResetToken(payload: PasswordResetTokenPayload): Result<string> {
  const options: jwt.SignOptions = {
    expiresIn: `${config.emailVerificationExpiresIn} minutes`,
    ...signOptions
  }

  return jwt.sign(payload, config.tokenSecret, options)
}
