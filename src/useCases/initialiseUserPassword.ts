import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import passwordSecurityCheck from "./passwordSecurityCheck"
import storePasswordResetCode from "./storePasswordResetCode"
import updatePassword from "./updatePassword"
import validateUserVerificationCode from "./validateUserVerificationCode"

const initialiseUserPassword = async (
  connection: Database,
  emailAddress: string,
  verificationCode: string,
  password: string
): PromiseResult<void> => {
  const passwordCheckResult = passwordSecurityCheck(password)
  if (isError(passwordCheckResult)) {
    return passwordCheckResult
  }

  // check if we have the correct user
  const validatedCodeResult = await validateUserVerificationCode(connection, emailAddress, verificationCode)
  if (isError(validatedCodeResult)) {
    return new Error("Invalid or expired verification code")
  }

  // set verification code to empty string
  const resetResult = await storePasswordResetCode(connection, emailAddress, null)
  if (isError(resetResult)) {
    return new Error("Failed to update table")
  }

  // set the new password
  const updateResult = await updatePassword(connection, emailAddress, password)
  if (isError(updateResult)) {
    return new Error("Failed to update password")
  }
  return undefined
}

export default initialiseUserPassword
