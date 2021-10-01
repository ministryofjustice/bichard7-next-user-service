import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import UserGroup from "types/UserGroup"

interface GetUserServiceAccessResult {
  hasAccessToBichard: boolean
  hasAccessToUserManagement: boolean
  hasAccessToAuditLogging: boolean
}

export default ({ groups }: AuthenticationTokenPayload): GetUserServiceAccessResult => {
  const hasAccessToBichard =
    ["B7Allocator", "B7Audit", "B7ExceptionHandler", "B7GeneralHandler", "B7Supervisor", "B7TriggerHandler"].filter(
      (g) => groups.includes(g as UserGroup)
    ).length > 0

  const hasAccessToUserManagement = groups.includes("B7UserManager" as UserGroup)

  const hasAccessToAuditLogging = groups.includes("B7AuditLoggingManager" as UserGroup)

  return { hasAccessToBichard, hasAccessToUserManagement, hasAccessToAuditLogging }
}
