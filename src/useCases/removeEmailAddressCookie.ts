import { serialize } from "cookie"
import { ServerResponse } from "http"
import { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"

export default (response: ServerResponse, config: UserServiceConfig): void => {
  const { rememberEmailAddressCookieName: cookieName } = config

  const cookie = serialize(cookieName, "", { httpOnly: true, maxAge: 0, path: "/users/login" })
  setCookie(response, cookie)
}
