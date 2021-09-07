import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import checkPasswordIsBanned from "./checkPasswordIsBanned"
import passwordDoesNotContainSensitive from "./passwordDoesNotContainSensitive"
import passwordSecurityCheck from "./passwordSecurityCheck"
import storePasswordResetCode from "./storePasswordResetCode"
import updatePassword from "./updatePassword"
import validateUserVerificationCode from "./validateUserVerificationCode"

const initialiseUserPassword = async (
  connection: Database,
  auditLogger: AuditLogger,
  emailAddress: string,
  verificationCode: string,
  password: string
): PromiseResult<void> => {
  const passwordCheckResult = passwordSecurityCheck(password)
  if (isError(passwordCheckResult)) {
    return passwordCheckResult
  }

  const passwordIsBanned = checkPasswordIsBanned(password)
  if (isError(passwordIsBanned)) {
    return passwordIsBanned
  }

  // check if we have the correct user
  const validatedCodeResult = await validateUserVerificationCode(connection, emailAddress, verificationCode)
  if (isError(validatedCodeResult)) {
    return new Error("Invalid or expired verification code")
  }

  const validatePasswordSensitveResult = await passwordDoesNotContainSensitive(connection, password, emailAddress)
  if (isError(validatePasswordSensitveResult)) {
    return validatePasswordSensitveResult
  }

  const resetResult = await storePasswordResetCode(connection, emailAddress, null)
  if (isError(resetResult)) {
    return new Error("Failed to update table")
  }

  const updateResult = await updatePassword(connection, emailAddress, password)
  if (isError(updateResult)) {
    return new Error("Failed to update password")
  }

  await auditLogger("New password", { user: { emailAddress } })

  return undefined
}

export default initialiseUserPassword
