import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import createVerificationEmail from "./createVerificationEmail"
import sendEmail from "./sendEmail"
import storeVerificationCode from "./storeVerificationCode"

const generateVerificationCode = () => {
  return randomDigits(config.verificationCodeLength).join("")
}

export default async (connection: Database, emailAddress: string): PromiseResult<void> => {
  const verificationCode = generateVerificationCode()
  const storeVerificationCodeResult = await storeVerificationCode(connection, emailAddress, verificationCode)

  if (isError(storeVerificationCodeResult)) {
    console.error(storeVerificationCodeResult)
    return storeVerificationCodeResult
  }

  const createVerificationEmailResult = createVerificationEmail(emailAddress, verificationCode)

  if (isError(createVerificationEmailResult)) {
    return createVerificationEmailResult
  }

  const { subject, body } = createVerificationEmailResult
  const sendEmailResult = await sendEmail(emailAddress, subject, body)

  return sendEmailResult
}
