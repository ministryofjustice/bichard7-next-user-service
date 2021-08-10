import { randomDigits } from "crypto-secure-random-digit"
import db from "lib/db"
import { EmailTokenPayload, generateEmailToken } from "lib/token/emailToken"

function generateVerificationCode() {
  return randomDigits(6).join("")
}

export async function storeVerificationCode(emailAddress: string, verificationCode: string) {
  const query = `
    UPDATE br7own.users
    SET email_verification_code = $1,
      email_verification_generated = NOW()
    WHERE email = $2
  `

  await db.none(query, [verificationCode, emailAddress])
}

function sendEmail(emailAddress: string, verificationCode: string) {
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
}

export default async function sendVerificationEmail(emailAddress: string) {
  const verificationCode = generateVerificationCode()
  await storeVerificationCode(emailAddress, verificationCode)
  sendEmail(emailAddress, verificationCode)
}
