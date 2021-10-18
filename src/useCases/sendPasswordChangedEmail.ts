import cjsmify from "lib/cjsmify"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
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

  const emailContent = createPasswordChangedEmail(user)

  const emailer = getEmailer()
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: cjsmify(emailAddress),
      ...emailContent
    })
    .catch((error: Error) => error)
}
