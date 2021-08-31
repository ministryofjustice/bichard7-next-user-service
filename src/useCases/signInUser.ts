import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"
import { generateAuthenticationToken } from "lib/token/authenticationToken"
import User from "types/User"
import setCookie from "utils/setCookie"

export default (response: ServerResponse, user: User): string => {
  const { authenticationCookieName } = config
  const authenticationToken = generateAuthenticationToken(user)
  setCookie(response, serialize(authenticationCookieName, authenticationToken, { httpOnly: true, path: "/" }))

  return authenticationToken
}
