import { ServerResponse } from "http"

export default (response: ServerResponse, cookie: string) => {
  let cookies: string[] = []
  const existingCookies = response.getHeader("Set-Cookie")
  console.log(" --- ", existingCookies)

  if (Array.isArray(existingCookies)) {
    cookies = existingCookies as string[]
  } else if (existingCookies) {
    cookies = [existingCookies as string]
  }

  let replacedOldCookie = false
  const cookieName = cookie.split("=")[0]
  for (let i = 0; i < cookies.length && !replacedOldCookie; i += 1) {
    if (cookies[i].startsWith(cookieName)) {
      cookies[i] = `${cookie}; Overwrite=true`
      replacedOldCookie = true
    }
  }
  console.log("replace old cookie ", cookies, " -- ", cookie)
  if (!replacedOldCookie) {
    cookies.push(`${cookie}; Overwrite=true`)
  }
  response.setHeader("Set-Cookie", cookies)
}
