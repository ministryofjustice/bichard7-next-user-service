import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"
import { generateAuthenticationToken } from "lib/token/authenticationToken"
import setCookie from "utils/setCookie"
import { v4 as uuidv4 } from "uuid"
import { isError } from "types/Result"
import Database from "types/Database"
import logJwt from "lib/logJwt"
import UserFullDetails from "types/UserFullDetails"

export default async (
  connection: Database,
  response: ServerResponse,
  user: UserFullDetails
): Promise<string | Error> => {
  const { authenticationCookieName } = config
  const uniqueId = uuidv4()

  const logJwtResult = await logJwt(connection, user.id, uniqueId)

  if (isError(logJwtResult)) {
    return logJwtResult
  }

  const authenticationToken = generateAuthenticationToken(user, uniqueId)
  setCookie(response, serialize(authenticationCookieName, authenticationToken, { httpOnly: true, path: "/" }))

  return authenticationToken
}
