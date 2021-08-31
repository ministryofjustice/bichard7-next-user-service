import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import storeVerificationCode from "./storeVerificationCode"

export default async (connection: Database, emailAddress: string, redirectUrl?: string): PromiseResult<URL> => {
  const verificationCode = randomDigits(config.verificationCodeLength).join("")
  const storeVerificationCodeResult = await storeVerificationCode(connection, emailAddress, verificationCode)

  if (isError(storeVerificationCodeResult)) {
    return storeVerificationCodeResult
  }

  const payload: EmailVerificationTokenPayload = {
    emailAddress,
    verificationCode
  }
  const token = generateEmailVerificationToken(payload)

  if (isError(token)) {
    return token
  }

  const url = new URL("/login/verify", config.baseUrl)
  url.searchParams.append("token", token)

  if (redirectUrl) {
    url.searchParams.append("redirect", redirectUrl)
  }

  return url
}
