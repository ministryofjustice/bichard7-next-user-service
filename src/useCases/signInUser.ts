import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"
import { generateAuthenticationToken, storeTokenId } from "lib/token/authenticationToken"
import setCookie from "utils/setCookie"
import { v4 as uuidv4 } from "uuid"
import { isError } from "types/Result"
import Database from "types/Database"
import UserFullDetails from "types/UserFullDetails"

export default async (
  connection: Database,
  response: ServerResponse,
  user: UserFullDetails
): Promise<string | Error> => {
  const { authenticationCookieName } = config
  const uniqueId = uuidv4()

  const storeTokenIdResult = await storeTokenId(connection, user.id, uniqueId)

  if (isError(storeTokenIdResult)) {
    return storeTokenIdResult
  }

  const authenticationToken = generateAuthenticationToken(user, uniqueId)
  setCookie(response, serialize(authenticationCookieName, authenticationToken, { httpOnly: true, path: "/" }))

  return authenticationToken
}
