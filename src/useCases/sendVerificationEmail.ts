import { randomDigits } from "crypto-secure-random-digit"
import { EmailTokenPayload, generateEmailToken } from "lib/token/emailToken"

const generateVerificationCode = () => {
  return randomDigits(6).join("")
}

const storeVerificationCode = async (connection: any, emailAddress: string, verificationCode: string) => {
  const storeVerificationQuery = `
    UPDATE br7own.users
    SET email_verification_code = $1,
      email_verification_generated = NOW()
    WHERE email = $2
  `
  try {
    await connection.none(storeVerificationQuery, [verificationCode, emailAddress])
    return undefined
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

const sendVerificationEmail = async (connection: any, emailAddress: string) => {
  const verificationCode = generateVerificationCode()
  try {
    await storeVerificationCode(connection, emailAddress, verificationCode)
  } catch (error) {
    return error
  }
  return sendEmail(emailAddress, verificationCode)
}

export default sendVerificationEmail
