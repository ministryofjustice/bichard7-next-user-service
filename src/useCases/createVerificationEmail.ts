import { EmailTokenPayload, generateEmailToken } from "lib/token/emailToken"
import EmailResult from "types/EmailResult"

export default (emailAddress: string, verificationCode: string): EmailResult => {
  const payload: EmailTokenPayload = {
    emailAddress,
    verificationCode
  }

  const token = generateEmailToken(payload)
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
