import generateLoginEmail from "emails/login"
import EmailContent from "types/EmailContent"
import { Result } from "types/Result"

export default (verificationUrl: string): Result<EmailContent> => {
  return generateLoginEmail({ url: verificationUrl })
}
