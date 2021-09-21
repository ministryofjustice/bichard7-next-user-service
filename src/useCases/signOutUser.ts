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
  const cookies = Object.keys(request.cookies).map((key) => `${key}=${request.cookies[key]}`)

  const cookieResult = getCookieValue(request.cookies, authenticationCookieName)
  if (cookieResult === undefined) {
    return new Error("")
  }

  const jwtId = cookieResult.id
  const removeJwtResult = await removeJwt(connection, jwtId)
  if (isError(removeJwtResult)) {
    console.error(removeJwtResult)
    return removeJwtResult
  }

  removeCookie(response, cookies, authenticationCookieName)
  return undefined
}
