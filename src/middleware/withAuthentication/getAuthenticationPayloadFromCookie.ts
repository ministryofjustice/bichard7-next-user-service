import config from "lib/config"
import { AuthenticationTokenPayload, decodeAuthenticationToken } from "lib/token/authenticationToken"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { Result } from "types/Result"

export default ({ cookies }: { cookies: NextApiRequestCookies }): Result<AuthenticationTokenPayload> => {
  const { authenticationCookieName } = config
  const authenticationToken = cookies[authenticationCookieName]

  if (!authenticationToken) {
    return Error("Authentication token not found.")
  }

  return decodeAuthenticationToken(authenticationToken)
}
