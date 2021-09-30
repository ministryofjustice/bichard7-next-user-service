import config from "lib/config"
import getConnection from "lib/getConnection"
import { decodeAuthenticationToken, isTokenIdValid } from "lib/token/authenticationToken"
import type { NextApiRequest, NextApiResponse } from "next"
import { isSuccess } from "types/Result"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookieValue = req.cookies[config.authenticationCookieName]
  const token = decodeAuthenticationToken(cookieValue)

  if (cookieValue && isSuccess(token)) {
    const database = getConnection()

    if (await isTokenIdValid(database, token.id)) {
      return res.status(200).json({ authenticated: true })
    }
  }

  return res.status(401).json({ authenticated: false })
}
