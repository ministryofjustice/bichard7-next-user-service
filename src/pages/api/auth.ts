import { serialize } from "cookie"
import config from "lib/config"
import getConnection from "lib/getConnection"
import { decodeAuthenticationToken, isTokenIdValid } from "lib/token/authenticationToken"
import { decodeTimeoutToken, generateTimeoutToken } from "lib/token/timeoutToken"
import type { NextApiRequest, NextApiResponse } from "next"
import { isSuccess } from "types/Result"
import { signOutUser } from "useCases"
import hasUserAccessToUrl from "useCases/hasUserAccessToUrl"
import updateUserLastLogin from "useCases/updateUserLastLogin"
import removeCookie from "utils/removeCookie"
import setCookie from "utils/setCookie"
import { v4 as uuid } from "uuid"

const unauthenticated = (res: NextApiResponse) => res.status(401).json({ authenticated: false, authorised: false })
const unauthorised = (res: NextApiResponse) => res.status(403).json({ authenticated: true, authorised: false })
const allowed = (res: NextApiResponse) => res.status(200).json({ authenticated: true, authorised: true })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authCookieValue = req.cookies[config.authenticationCookieName]
  const authToken = decodeAuthenticationToken(authCookieValue)
  const connection = getConnection()

  if (authCookieValue && isSuccess(authToken) && (await isTokenIdValid(connection, authToken.id))) {
    const { referer } = req.headers

    if (hasUserAccessToUrl(authToken, referer)) {
      const timeoutCookieValue = req.cookies[config.timeoutInactivityCookieName]
      const timeoutToken = decodeTimeoutToken(timeoutCookieValue)
      console.log(" - token ", timeoutToken)

      if (
        timeoutCookieValue &&
        isSuccess(timeoutToken) &&
        new Date().getTime() - new Date(timeoutToken.dateOfCreation).getTime() < 1000 * 30
      ) {
        const newTimeoutToken = generateTimeoutToken(authToken.username, uuid(), new Date())

        removeCookie(res, req.cookies, config.timeoutInactivityCookieName)
        setCookie(res, serialize(config.timeoutInactivityCookieName, newTimeoutToken, { httpOnly: true, path: "/" }))

        await updateUserLastLogin(connection, authToken.username)
        return allowed(res)
      }

      await signOutUser(connection, res, req)
      return unauthenticated(res)
    }

    return unauthorised(res)
  }

  return unauthenticated(res)
}
