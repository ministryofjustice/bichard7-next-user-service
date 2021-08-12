import { randomDigits } from "crypto-secure-random-digit"
import Database from "types/Database"
import { isError } from "types/Result"
import sendEmail from "./sendEmail"
import storeVerificationCode from "./storeVerificationCode"

const generateVerificationCode = () => {
  return randomDigits(6).join("")
}

const sendVerificationEmail = async (connection: Database, emailAddress: string) => {
  const verificationCode = generateVerificationCode()
  let stored
  try {
    stored = await storeVerificationCode(connection, emailAddress, verificationCode)

    if (isError(stored)) {
      console.error(stored)
      return stored
    }
  } catch (error) {
    return error
  }
  return stored && sendEmail(emailAddress, verificationCode)
}

export default sendVerificationEmail
