import { ServerResponse } from "http"

export default (response: ServerResponse, cookies: string[], cookieName: string) => {
  const newCookies: string[] = []

  for (let i = 0; i < cookies.length; i += 1) {
    const key = cookies[i].trim().split("=")[0]
    if (key !== cookieName) {
      newCookies.push(`${key}=${cookies[i].trim().split("=")[1]}`)
    }
  }

  response.setHeader("Set-Cookie", newCookies)
}
