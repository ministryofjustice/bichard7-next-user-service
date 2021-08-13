import { EmailTokenPayload, generateEmailToken } from "lib/token/emailToken"

const sendNewUserEmail = (emailAddress: string, verificationCode: string) => {
  const payload: EmailTokenPayload = {
    emailAddress,
    verificationCode
  }

  const token = generateEmailToken(payload)
  const url = new URL("/users/newPassword", "http://localhost:3000")
  url.searchParams.append("token", token)

  // eslint-disable-next-line no-console
  console.log(`
    TO: ${emailAddress}

    Click here to set password in Bichard:
    ${url.href}
  `)

  return true
}

export default sendNewUserEmail
