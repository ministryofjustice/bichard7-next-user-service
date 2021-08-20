import { serialize } from "cookie"
import { ServerResponse } from "http"
import { generateAuthenticationToken } from "lib/token/authenticationToken"
import User from "types/User"

export default (response: ServerResponse, user: User): string => {
  const authenticationToken = generateAuthenticationToken(user)
  response.setHeader("Set-Cookie", serialize(".AUTH", authenticationToken, { httpOnly: true }))

  return authenticationToken
}
