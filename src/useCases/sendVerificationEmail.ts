import { addCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import createVerificationEmail from "./createVerificationEmail"
import generateEmailVerificationUrl from "./generateEmailVerificationUrl"

export default async (connection: Database, emailAddress: string, redirectPath?: string): PromiseResult<void> => {
  const verificationUrl = await generateEmailVerificationUrl(connection, config, emailAddress, redirectPath)

  if (isError(verificationUrl)) {
    return verificationUrl
  }

  const createVerificationEmailResult = createVerificationEmail(verificationUrl.href)

  if (isError(createVerificationEmailResult)) {
    return createVerificationEmailResult
  }

  const emailContent = createVerificationEmailResult

  const emailer = getEmailer(emailAddress)
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(emailAddress),
      ...emailContent
    })
    .catch((error: Error) => error)
}
