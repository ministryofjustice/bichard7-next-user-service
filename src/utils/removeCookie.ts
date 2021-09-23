import { ServerResponse } from "http"
import { NextApiRequestCookies } from "next/dist/server/api-utils"

export default (response: ServerResponse, cookies: NextApiRequestCookies, cookieName: string) => {
  const newCookies: string[] = []

  Object.keys(cookies).forEach((key) => {
    if (key !== cookieName) {
      newCookies.push(`${key}=${cookies[key].trim().split("=")[1]}`)
    }
  })

  response.setHeader("Set-Cookie", newCookies)
}
