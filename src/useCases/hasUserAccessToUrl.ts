import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "./getUserServiceAccess"

const userServiceUrlExpression = /^\/users\/users.*/
const bichardUrlExpression = /^\/bichard-ui.*/

export default (token: AuthenticationTokenPayload, url?: string): boolean => {
  if (!url) {
    return false
  }

  const { hasAccessToBichard, hasAccessToUserManagement } = getUserServiceAccess(token)

  if (
    (url.match(userServiceUrlExpression) && !hasAccessToUserManagement) ||
    (url.match(bichardUrlExpression) && !hasAccessToBichard)
  ) {
    return false
  }

  return true
}
