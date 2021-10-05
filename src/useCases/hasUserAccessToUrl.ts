import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "./getUserServiceAccess"

const allowedUrlsRegEx = /(?=^\/users\/home.*)(?=^\/users\/account.*)(?=^\/users\/logout.*)/
const userServiceUrlRegEx = /^\/users.*/
const bichardUrlRegEx = /^\/bichard-ui.*/

export default (token: AuthenticationTokenPayload, url?: string): boolean => {
  if (!url) {
    return false
  }

  const { hasAccessToBichard, hasAccessToUserManagement } = getUserServiceAccess(token)

  if (
    url.match(allowedUrlsRegEx) ||
    (url.match(userServiceUrlRegEx) && hasAccessToUserManagement) ||
    (url.match(bichardUrlRegEx) && hasAccessToBichard)
  ) {
    return true
  }

  return false
}
