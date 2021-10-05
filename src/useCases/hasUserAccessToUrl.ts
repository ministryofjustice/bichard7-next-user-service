import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "./getUserServiceAccess"

const allowedUrlsExpression =
  /^\/users$|^\/users\/$|^\/users\/(login|logout|account|assets|_next\/static|access-denied).*/
const userServiceUrlExpression = /^\/users.*/
const bichardUrlExpression = /^\/bichard-ui.*/

export default (token: AuthenticationTokenPayload, url?: string): boolean => {
  if (!url) {
    return false
  }

  const { hasAccessToBichard, hasAccessToUserManagement } = getUserServiceAccess(token)

  if (
    url.match(allowedUrlsExpression) ||
    (url.match(userServiceUrlExpression) && hasAccessToUserManagement) ||
    (url.match(bichardUrlExpression) && hasAccessToBichard)
  ) {
    return true
  }

  return false
}
