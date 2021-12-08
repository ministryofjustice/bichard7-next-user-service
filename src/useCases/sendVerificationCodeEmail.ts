import { randomDigits } from "crypto-secure-random-digit"
import { addCjsmSuffix, removeCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import storeVerificationCode from "./storeVerificationCode"
import generateLoginV2Email from "../emails/loginV2"

export default async (connection: Database, emailAddress: string): PromiseResult<void> => {
  const normalisedEmail = removeCjsmSuffix(emailAddress)

  const code = randomDigits(config.verificationCodeLength).join("")
  await storeVerificationCode(connection, emailAddress, code)

  const createVerificationEmailResult = generateLoginV2Email({ code })

  if (isError(createVerificationEmailResult)) {
    return createVerificationEmailResult
  }

  const emailContent = createVerificationEmailResult

  const emailer = getEmailer(normalisedEmail)
  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(normalisedEmail),
      ...emailContent
    })
    .then(() => console.log(`Email successfully sent to ${emailAddress}`))
    .catch((error: Error) => {
      console.error(`Error sending email to ${emailAddress}`, error.message)
      return error
    })
}
