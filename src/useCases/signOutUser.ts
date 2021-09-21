import { ServerResponse } from "http"
import config from "lib/config"
import removeJwt from "lib/removeJwt"
import Database from "types/Database"
import { isError } from "types/Result"
import removeCookie from "utils/removeCookie"
import getCookieValue from "utils/getCookieValue"

export default async (connection: Database, response: ServerResponse) => {
  const { authenticationCookieName } = config
  let cookies: string[] = []

  const existingCookies = response.getHeader("Set-Cookie")
  if (Array.isArray(existingCookies)) {
    cookies = existingCookies as string[]
  } else {
    cookies = [existingCookies as string]
  }

  const cookieResult = getCookieValue(cookies, authenticationCookieName)
  if (cookieResult === undefined) {
    return new Error("")
  }

  const jwtId = cookieResult.id
  const removeJwtResult = await removeJwt(connection, jwtId)
  if (isError(removeJwtResult)) {
    console.error(removeJwtResult)
    return removeJwtResult
  }

  removeCookie(response, authenticationCookieName)
  return undefined
}
