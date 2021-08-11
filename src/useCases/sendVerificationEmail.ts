import { randomDigits } from "crypto-secure-random-digit"
import isError from "lib/isError"
import { EmailTokenPayload, generateEmailToken } from "lib/token/emailToken"
import Database from "types/Database"

const generateVerificationCode = () => {
  return randomDigits(6).join("")
}

const storeVerificationCode = async (connection: Database, emailAddress: string, verificationCode: string) => {
  const storeVerificationQuery = `
    UPDATE br7own.users
    SET email_verification_code = $1,
      email_verification_generated = NOW()
    WHERE email = $2 AND deleted_at IS NULL
  `
  try {
    await connection.none(storeVerificationQuery, [verificationCode, emailAddress])
    return true
  } catch (error) {
    return error
  }
}

const sendEmail = (emailAddress: string, verificationCode: string) => {
  const payload: EmailTokenPayload = {
    emailAddress,
    verificationCode
  }

  const token = generateEmailToken(payload)
  const url = new URL("/login/verify", "http://localhost:3000")
  url.searchParams.append("token", token)

  // eslint-disable-next-line no-console
  console.log(`
    TO: ${emailAddress}

    Click here to log in to Bichard:
    ${url.href}
  `)

  return true
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
