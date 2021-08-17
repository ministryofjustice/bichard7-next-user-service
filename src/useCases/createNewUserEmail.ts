import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import EmailResult from "types/EmailResult"
import { isError, Result } from "types/Result"
import UserCreateDetails from "types/UserCreateDetails"

export default (user: UserCreateDetails, verificationCode: string): Result<EmailResult> => {
  const payload: EmailVerificationTokenPayload = {
    emailAddress: user.emailAddress,
    verificationCode
  }

  const token = generateEmailVerificationToken(payload)
  if (isError(token)) {
    return token
  }
  const url = new URL("/login/new-password", "http://localhost:3000")
  url.searchParams.append("token", token)

  const subject = "Finish account setup"
  const body = `
  Hi ${user.forenames} ${user.surname}
  Click here to set your password:
  ${url.href}
  `
  return { subject, body }
}
