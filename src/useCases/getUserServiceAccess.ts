import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import UserGroup from "types/UserGroup"

interface GetUserServiceAccessResult {
  hasAccessToBichard: boolean
  hasAccessToUserManagement: boolean
  hasAccessToAuditLogging: boolean
  hasAccessToReports: boolean
  hasAccessToNewBichard: boolean
}

const bichardGroups = [
  "B7Allocator",
  "B7Audit",
  "B7ExceptionHandler",
  "B7GeneralHandler",
  "B7Supervisor",
  "B7TriggerHandler",
  "B7NewUI"
]

export default ({ groups }: AuthenticationTokenPayload): GetUserServiceAccessResult => {
  const hasAccessToBichard = bichardGroups.some((g) => groups.includes(g as UserGroup))

  const hasAccessToUserManagement = groups.includes("B7UserManager" as UserGroup)

  const hasAccessToAuditLogging = groups.includes("B7AuditLoggingManager" as UserGroup)

  const hasAccessToNewBichard = groups.includes("B7NewUI" as UserGroup)

  const hasAccessToReports = bichardGroups.some((g) => groups.includes(g as UserGroup))

  return {
    hasAccessToBichard,
    hasAccessToUserManagement,
    hasAccessToAuditLogging,
    hasAccessToReports,
    hasAccessToNewBichard
  }
}
