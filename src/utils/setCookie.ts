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

  cookies.push(cookie)
  response.setHeader("Set-Cookie", cookies)
}
