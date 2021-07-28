import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import db from "lib/db"
import jwt from "jsonwebtoken"
import { EmailTokenPayload } from "./Token"

function generateVerificationCode() {
  return randomDigits(6).join("")
}

async function storeVerificationCode(emailAddress: string, verificationCode: string) {
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

  const options: jwt.SignOptions = {
    expiresIn: "3 hours",
    issuer: config.tokenIssuer
  }

  const token = jwt.sign(payload, config.tokenSecret, options)

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
