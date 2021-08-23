import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import createPasswordResetEmail from "./createPasswordResetEmail"
import getUserByEmailAddress from "./getUserByEmailAddress"
import storePasswordResetCode from "./storePasswordResetCode"

export default async (connection: Database, emailAddress: string): PromiseResult<void> => {
  const user = await getUserByEmailAddress(connection, emailAddress)

  if (isError(user)) {
    return user
  }

  if (!user) {
    return undefined
  }

  const passwordResetCode = randomDigits(6).join("")
  const updateUserResult = await storePasswordResetCode(connection, emailAddress, passwordResetCode)

  if (isError(updateUserResult)) {
    return updateUserResult
  }

  const createPasswordResetEmailResult = createPasswordResetEmail(user, passwordResetCode)

  if (isError(createPasswordResetEmailResult)) {
    return createPasswordResetEmailResult
  }

  const email = createPasswordResetEmailResult

  const emailer = getEmailer()
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: emailAddress,
      ...email
    })
    .catch((error: Error) => error)
}
