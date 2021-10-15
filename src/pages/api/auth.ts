import config from "lib/config"
import getConnection from "lib/getConnection"
import { decodeAuthenticationToken, isTokenIdValid } from "lib/token/authenticationToken"
import type { NextApiRequest, NextApiResponse } from "next"
import { isSuccess } from "types/Result"
import hasUserAccessToUrl from "useCases/hasUserAccessToUrl"

const unauthenticated = (res: NextApiResponse) => res.status(401).json({ authenticated: false, authorised: false })
const unauthorised = (res: NextApiResponse) => res.status(403).json({ authenticated: true, authorised: false })
const allowed = (res: NextApiResponse) => res.status(200).json({ authenticated: true, authorised: true })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookieValue = req.cookies[config.authenticationCookieName]
  const token = decodeAuthenticationToken(cookieValue)

  if (cookieValue && isSuccess(token) && (await isTokenIdValid(getConnection(), token.id))) {
    const { referer } = req.headers

    if (hasUserAccessToUrl(token, referer)) {
      return allowed(res)
    }

    return unauthorised(res)
  }

  return unauthenticated(res)
}
