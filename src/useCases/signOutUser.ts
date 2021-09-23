import { IncomingMessage, ServerResponse } from "http"
import config from "lib/config"
import removeJwt from "lib/removeJwt"
import Database from "types/Database"
import { isError } from "types/Result"
import removeCookie from "utils/removeCookie"
import getCookieValue from "utils/getCookieValue"
import { NextApiRequestCookies } from "next/dist/server/api-utils"

export default async (
  connection: Database,
  response: ServerResponse,
  request: IncomingMessage & {
    cookies: NextApiRequestCookies
  }
) => {
  const { authenticationCookieName } = config

  const cookieResult = getCookieValue(request.cookies, authenticationCookieName)
  if (cookieResult === undefined) {
    return new Error("No authentication cookie found")
  }

  const jwtId = cookieResult.id
  const removeJwtResult = await removeJwt(connection, jwtId)
  if (isError(removeJwtResult)) {
    console.error(removeJwtResult)
    return removeJwtResult
  }

  removeCookie(response, request.cookies, authenticationCookieName)
  return undefined
}
