import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"
import setCookie from "utils/setCookie"

export default (response: ServerResponse): void => {
  const { rememberEmailAddressCookieName: cookieName } = config

  const cookie = serialize(cookieName, "", { httpOnly: true, maxAge: 0, path: "/login" })
  setCookie(response, cookie)
}
