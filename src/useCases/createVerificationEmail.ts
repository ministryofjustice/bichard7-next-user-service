import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import EmailResult from "types/EmailResult"
import { isError, Result } from "types/Result"

export default (emailAddress: string, verificationCode: string, redirectUrl?: string): Result<EmailResult> => {
  const payload: EmailVerificationTokenPayload = {
    emailAddress,
    verificationCode
  }
  const token = generateEmailVerificationToken(payload)
  if (isError(token)) {
    return token
  }
  const url = new URL("/login/verify", "http://localhost:3000")
  url.searchParams.append("token", token)

  if (redirectUrl) {
    url.searchParams.append("redirect", redirectUrl)
  }

  const subject = "Sign in to Bichard"
  const body = `
    TO: ${emailAddress}

    Click here to log in to Bichard:
    ${url.href}
  `

  return { subject, body }
}
