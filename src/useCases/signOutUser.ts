import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"
import setCookie from "utils/setCookie"

export default (response: ServerResponse) => {
  const { authenticationCookieName } = config
  setCookie(response, serialize(authenticationCookieName, "", { httpOnly: true, path: "/", maxAge: 0 }))
}
