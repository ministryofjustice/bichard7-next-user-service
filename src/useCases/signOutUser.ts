import { serialize } from "cookie"
import { ServerResponse } from "http"
import config from "lib/config"

export default (response: ServerResponse) => {
  const { authenticationCookieName } = config
  response.setHeader("Set-Cookie", serialize(authenticationCookieName, "", { httpOnly: true, path: "/", maxAge: 0 }))
}
