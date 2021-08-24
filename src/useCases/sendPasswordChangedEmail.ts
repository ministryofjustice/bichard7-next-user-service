import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import createPasswordChangedEmail from "./createPasswordChangedEmail"
import getUserByEmailAddress from "./getUserByEmailAddress"

export default async (connection: Database, emailAddress: string): PromiseResult<void> => {
  const user = await getUserByEmailAddress(connection, emailAddress)

  if (isError(user)) {
    return user
  }

  if (!user) {
    return undefined
  }

  const email = createPasswordChangedEmail(user)

  const emailer = getEmailer()
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: emailAddress,
      ...email
    })
    .catch((error: Error) => error)
}
