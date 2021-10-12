import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "./getUserServiceAccess"

const userManagementUrlExpression = /^\/users\/users.*/
const bichardUrlExpression = /^\/bichard-ui.*/
const auditLoggingUrlExpression = /^\/audit-logging.*/

export default (token: AuthenticationTokenPayload, url?: string): boolean => {
  if (!url) {
    return false
  }

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToAuditLogging } = getUserServiceAccess(token)

  if (
    (url.match(userManagementUrlExpression) && !hasAccessToUserManagement) ||
    (url.match(bichardUrlExpression) && !hasAccessToBichard) ||
    (url.match(auditLoggingUrlExpression) && !hasAccessToAuditLogging)
  ) {
    return false
  }

  return true
}
