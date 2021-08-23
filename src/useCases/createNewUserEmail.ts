import generateNewUserEmail from "emails/newUser"
import config from "lib/config"
import { EmailVerificationTokenPayload, generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import EmailContent from "types/EmailContent"
import { isError, Result } from "types/Result"
import UserCreateDetails from "types/UserDetails"

export default (user: UserCreateDetails, verificationCode: string): Result<EmailContent> => {
  const payload: EmailVerificationTokenPayload = {
    emailAddress: user.emailAddress,
    verificationCode
  }

  const token = generateEmailVerificationToken(payload)
  if (isError(token)) {
    return token
  }

  const url = new URL("/login/new-password", config.baseUrl)
  url.searchParams.append("token", token)

  return generateNewUserEmail({ url: url.href, user })
}
