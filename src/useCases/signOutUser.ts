import { IncomingMessage, ServerResponse } from "http"
import config from "lib/config"
import { removeTokenId } from "lib/token/authenticationToken"
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
  const removeTokenIdResult = await removeTokenId(connection, jwtId)
  if (isError(removeTokenIdResult)) {
    console.error(removeTokenIdResult)
    return removeTokenIdResult
  }

  removeCookie(response, request.cookies, authenticationCookieName)
  return undefined
}
