import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import addPasswordHistory from "./addPasswordHistory"
import checkPassword from "./checkPassword"
import checkPasswordIsBanned from "./checkPasswordIsBanned"
import checkPasswordIsNew from "./checkPasswordIsNew"
import getUserLoginDetailsByEmailAddress from "./getUserLoginDetailsByEmailAddress"
import passwordDoesNotContainSensitive from "./passwordDoesNotContainSensitive"
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
  const passwordIsBanned = checkPasswordIsBanned(newPassword)

  if (isError(passwordIsBanned)) {
    return passwordIsBanned
  }

  const validatePasswordSensitveResult = await passwordDoesNotContainSensitive(connection, newPassword, emailAddress)

  if (isError(validatePasswordSensitveResult)) {
    return validatePasswordSensitveResult
  }

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

  const getUserResult = await getUserLoginDetailsByEmailAddress(connection, emailAddress)
  if (isError(getUserResult)) {
    return getUserResult
  }

  const result = await connection
    .task("update-and-store-old-password", async (taskConnection) => {
      const addHistoricalPassword = await addPasswordHistory(taskConnection, getUserResult.id, getUserResult.password)

      if (isError(addHistoricalPassword)) {
        return addHistoricalPassword
      }

      const checkPasswordIsNewResult = await checkPasswordIsNew(taskConnection, getUserResult.id, newPassword)

      if (isError(checkPasswordIsNewResult)) {
        return Error("Cannot use previously used password.")
      }

      const updatePasswordResult = await updatePassword(taskConnection, emailAddress, newPassword)

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
    })
    .catch((error) => {
      return error
    })

  return result
}
