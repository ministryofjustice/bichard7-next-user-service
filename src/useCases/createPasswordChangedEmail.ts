import generatePasswordChangedEmail from "emails/passwordChanged"
import config from "lib/config"
import EmailContent from "types/EmailContent"
import User from "types/User"

export default (user: User): EmailContent => {
  const url = new URL("/login", config.baseUrl)

  return generatePasswordChangedEmail({ url: url.href, user })
}
