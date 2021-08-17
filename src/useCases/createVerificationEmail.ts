import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import EmailResult from "types/EmailResult"

export default (emailAddress: string, verificationCode: string): EmailResult => {
  const payload: EmailVerificationTokenPayload = {
    emailAddress,
    verificationCode
  }

  const token = generateEmailVerificationToken(payload)
  const url = new URL("/login/verify", "http://localhost:3000")
  url.searchParams.append("token", token)

  const subject = "Sign in to Bichard"
  const body = `
    TO: ${emailAddress}

    Click here to log in to Bichard:
    ${url.href}
  `

  return { subject, body }
}
