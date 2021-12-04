import { randomDigits } from "crypto-secure-random-digit"
import { UserServiceConfig } from "lib/config"
import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import { addBasePath } from "next/dist/shared/lib/router/router"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import storeVerificationCode from "./storeVerificationCode"

export default async (
  connection: Database,
  config: UserServiceConfig,
  emailAddress: string,
  baseUrl: string,
  redirectPath?: string
): PromiseResult<URL | undefined> => {
  const verificationCode = randomDigits(config.verificationCodeLength).join("")
  const storeVerificationCodeResult = await storeVerificationCode(connection, emailAddress, verificationCode)

  if (isError(storeVerificationCodeResult)) {
    return storeVerificationCodeResult
  }

  // If we successfully didn't store the verification code (i.e. the user doesn't exist)
  // then don't generate a URL
  if (!storeVerificationCodeResult) {
    return undefined
  }

  const payload: EmailVerificationTokenPayload = {
    emailAddress,
    verificationCode
  }
  const token = generateEmailVerificationToken(payload)

  if (isError(token)) {
    return token
  }

  const url = new URL(addBasePath("/login/verify"), baseUrl)
  url.searchParams.append("token", token)

  if (redirectPath) {
    url.searchParams.append("redirect", redirectPath)
  }

  return url
}
