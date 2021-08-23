import generatePasswordResetEmail from "emails/passwordReset"
import { generatePasswordResetToken, PasswordResetTokenPayload } from "lib/token/passwordResetToken"
import EmailContent from "types/EmailContent"
import { isError, Result } from "types/Result"
import User from "types/User"

export default (user: User, passwordResetCode: string): Result<EmailContent> => {
  const payload: PasswordResetTokenPayload = { emailAddress: user.emailAddress, passwordResetCode }
  const token = generatePasswordResetToken(payload)

  if (isError(token)) {
    return token
  }

  const url = new URL("/login/reset-password", "http://localhost:3000")
  url.searchParams.append("token", token)

  return generatePasswordResetEmail({ url: url.href, user })
}
