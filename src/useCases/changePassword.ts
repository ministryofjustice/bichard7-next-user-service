import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import checkPassword from "./checkPassword"
import passwordSecurityCheck from "./passwordSecurityCheck"
import sendPasswordChangedEmail from "./sendPasswordChangedEmail"
import updatePassword from "./updatePassword"

export default async (
  connection: Database,
  auditLogger: AuditLogger,
  emailAddress: string,
  currentPassword: string,
  newPassword: string
): PromiseResult<void> => {
  const passwordCheckResult = passwordSecurityCheck(newPassword)

  if (isError(passwordCheckResult)) {
    return passwordCheckResult
  }

  const passwordMatch = await checkPassword(connection, emailAddress, currentPassword)

  if (isError(passwordMatch)) {
    console.error(passwordMatch)
    return Error("Server error. Please try again later.")
  }

  if (!passwordMatch) {
    return Error("Your current password is incorrect.")
  }

  const updatePasswordResult = await updatePassword(connection, emailAddress, newPassword)

  if (isError(updatePasswordResult)) {
    console.error(updatePasswordResult)
    return Error("Server error. Please try again later.")
  }

  await auditLogger("Change password")

  const sendPasswordChangedEmailResult = await sendPasswordChangedEmail(connection, emailAddress)

  if (isError(sendPasswordChangedEmailResult)) {
    console.error(sendPasswordChangedEmailResult)
  }

  return undefined
}
