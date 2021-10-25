import config from "lib/config"
import getConnection from "lib/getConnection"
import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { isError } from "types/Result"
import getUsersLastLogin from "./getUsersLastLogin"

export default async ({ emailAddress }: AuthenticationTokenPayload): Promise<boolean> => {
  const lastLogIn = await getUsersLastLogin(getConnection(), emailAddress)
  if (!lastLogIn || isError(lastLogIn)) {
    return false
  }
  const timeFromLastLogin = Math.floor(
    (new Date().getUTCDate() - new Date(lastLogIn.last_logged_in).getUTCDate()) / (1000 * 60)
  )
  if (timeFromLastLogin > config.timeoutInactivity) {
    return true
  }
  return false
}
