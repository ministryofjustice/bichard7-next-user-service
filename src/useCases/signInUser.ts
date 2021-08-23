import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"
import { generateAuthenticationToken } from "lib/token/authenticationToken"
import User from "types/User"

export default (response: ServerResponse, user: User): string => {
  const { authenticationCookieName } = config
  const authenticationToken = generateAuthenticationToken(user)
  response.setHeader(
    "Set-Cookie",
    serialize(authenticationCookieName, authenticationToken, { httpOnly: true, path: "/" })
  )

  return authenticationToken
}
