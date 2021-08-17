import { generatePasswordResetToken, PasswordResetTokenPayload } from "lib/token/passwordResetToken"
import EmailResult from "types/EmailResult"
import { isError, Result } from "types/Result"
import UserCreateDetails from "types/UserCreateDetails"

export default (user: UserCreateDetails, verificationCode: string): Result<EmailResult> => {
  const payload: PasswordResetTokenPayload = {
    emailAddress: user.emailAddress,
    passwordResetCode: verificationCode
  }

  const token = generatePasswordResetToken(payload)
  if (isError(token)) {
    return token
  }
  const url = new URL("/users/newPassword", "http://localhost:3000")
  url.searchParams.append("token", token)

  const subject = "Finish account setup"
  const body = `
  Hi ${user.forenames} ${user.surname}
  Click here to set your password:
  ${url.href}
  `
  return { subject, body }
}
