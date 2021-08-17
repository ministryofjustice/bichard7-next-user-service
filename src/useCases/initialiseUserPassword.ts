import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import storePasswordResetCode from "./storePasswordResetCode"
import updateUserPassword from "./updateUserPassword"
import validateUserVerificationCode from "./validateUserVerificationCode"

const initialiseUserPassword = async (
  connection: Database,
  emailAddress: string,
  verificationCode: string,
  password: string
): PromiseResult<void> => {
  // check if we have the correct user
  const validatedResult = await validateUserVerificationCode(connection, emailAddress, verificationCode)
  if (isError(validatedResult)) {
    return new Error("Error: Invalid verification code")
  }
  // set verification code to empty string
  const resetResult = await storePasswordResetCode(connection, emailAddress, null)
  if (isError(resetResult)) {
    return new Error("Error: Failed to update table")
  }

  // set the new password
  const updateResult = await updateUserPassword(connection, emailAddress, password)
  if (isError(updateResult)) {
    return new Error("Error: Failed to update password")
  }
  return undefined
}

export default initialiseUserPassword
