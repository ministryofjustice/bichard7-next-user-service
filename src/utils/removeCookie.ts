import { ServerResponse } from "http"

export default (response: ServerResponse, cookieName: string) => {
  let cookies: string[] = []
  const newCookies: string[] = []
  const existingCookies = response.getHeader("Set-Cookie")

  if (Array.isArray(existingCookies)) {
    cookies = existingCookies as string[]
  } else if (existingCookies) {
    cookies = [existingCookies as string]
  }

  for (let i = 0; i < cookies.length; i += 1) {
    const key = cookies[i].trim().split("=")[0]
    if (key !== cookieName) {
      newCookies.push(key)
    }
  }

  response.setHeader("Set-Cookie", newCookies)
}
