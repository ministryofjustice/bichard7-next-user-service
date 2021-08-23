import config from "lib/config"
import { decodeAuthenticationToken } from "lib/token/authenticationToken"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { isError, Result } from "types/Result"
import User from "types/User"

export default ({ cookies }: { cookies: NextApiRequestCookies }): Result<Partial<User>> => {
  const { authenticationCookieName } = config
  const authenticationToken = cookies[authenticationCookieName]

  if (!authenticationToken) {
    return Error("Authentication token not found.")
  }

  const authentication = decodeAuthenticationToken(authenticationToken)

  if (isError(authentication)) {
    return authentication
  }

  const currentUser = {
    username: authentication.username,
    emailAddress: authentication.emailAddress,
    inclusionList: authentication.inclusionList,
    exclusionList: authentication.exclusionList,
    groups: authentication.groups
  }

  return currentUser
}
