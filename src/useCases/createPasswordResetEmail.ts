import { generatePasswordResetToken, PasswordResetTokenPayload } from "lib/token/passwordResetToken"
import EmailResult from "types/EmailResult"
import { isError, Result } from "types/Result"
import User from "types/User"

export default (user: User, passwordResetCode: string): Result<EmailResult> => {
  const payload: PasswordResetTokenPayload = { emailAddress: user.emailAddress, passwordResetCode }
  const token = generatePasswordResetToken(payload)

  if (isError(token)) {
    return token
  }

  const url = new URL("/login/reset-password", "http://localhost:3000")
  url.searchParams.append("token", token)

  const subject = "Password reset request"
  const body = `
  Hi ${user.forenames} ${user.surname}
  Click here to reset your password:
  ${url.href}
  `
  return { subject, body }
}
