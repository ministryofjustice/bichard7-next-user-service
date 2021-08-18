import { serialize } from "cookie"
import { sign } from "cookie-signature"
import Tokens from "csrf"
import { IncomingMessage, ServerResponse } from "http"
import config from "lib/config"

const tokens = new Tokens()

export default (request: IncomingMessage, response: ServerResponse) => {
  const { tokenName, cookieSecret, formSecret, cookieTokenMaximumAgeInSeconds } = config.csrf
  const token = tokens.create(`${cookieSecret}${formSecret}`)
  const cookieSignedToken = sign(token, cookieSecret)
  const cookieName = encodeURIComponent(`${tokenName}${request.url}`)
  const formSignedToken = sign(`${cookieName}=${token}`, formSecret)

  response.setHeader(
    "Set-Cookie",
    serialize(cookieName, cookieSignedToken, { httpOnly: true, maxAge: cookieTokenMaximumAgeInSeconds })
  )

  return formSignedToken
}
