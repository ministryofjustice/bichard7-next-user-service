import config from "lib/config"
import jwt from "jsonwebtoken"

export default function sendVerificationEmail(emailAddress: string) {
  const payload = { emailAddress }

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
