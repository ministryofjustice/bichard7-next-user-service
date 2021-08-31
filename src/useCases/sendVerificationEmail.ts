import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import createVerificationEmail from "./createVerificationEmail"
import generateEmailVerificationUrl from "./generateEmailVerificationUrl"

export default async (connection: Database, emailAddress: string, redirectUrl?: string): PromiseResult<void> => {
  const verificationUrl = await generateEmailVerificationUrl(connection, emailAddress, redirectUrl)

  if (isError(verificationUrl)) {
    return verificationUrl
  }

  const createVerificationEmailResult = createVerificationEmail(verificationUrl.href)

  if (isError(createVerificationEmailResult)) {
    return createVerificationEmailResult
  }

  const emailContent = createVerificationEmailResult

  const emailer = getEmailer()
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: emailAddress,
      ...emailContent
    })
    .catch((error: Error) => error)
}
