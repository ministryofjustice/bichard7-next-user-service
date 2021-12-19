import generateNewUserEmail from "emails/newUser"
import { addBasePath } from "next/dist/shared/lib/router/router"
import EmailContent from "types/EmailContent"
import { Result } from "types/Result"
import UserCreateDetails from "types/UserDetails"

export default (user: UserCreateDetails, baseUrl: string): Result<EmailContent> => {
  const url = new URL(addBasePath("/account/change-password"), baseUrl)

  return generateNewUserEmail({ url: url.href, user })
}
