import { EmailTokenPayload, generateEmailToken } from "lib/token/emailToken"

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

export default sendEmail
