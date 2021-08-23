import generateLoginEmail from "emails/login"
import config from "lib/config"
import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import EmailContent from "types/EmailContent"
import { isError, Result } from "types/Result"

export default (emailAddress: string, verificationCode: string, redirectUrl?: string): Result<EmailContent> => {
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

  return generateLoginEmail({ url: url.href })
}
