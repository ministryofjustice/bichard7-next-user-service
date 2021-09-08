import jwt from "jsonwebtoken"
import tokenSecret from "./tokenSecrete"

export const invalidToken = () => jwt.sign({ foo: "bar" }, tokenSecret, { issuer: "Bichard" })

export const validToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

export const generatePasswordResetToken = (emailAddress, passwordResetCode) =>
  jwt.sign({ emailAddress, passwordResetCode }, tokenSecret, { issuer: "Bichard" })

export const generateLoginVerificationToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

export const generateNewPasswordToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })
