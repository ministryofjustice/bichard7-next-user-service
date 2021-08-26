import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import checkPassword from "./checkPassword"
import passwordSecurityCheck from "./passwordSecurityCheck"
import sendPasswordChangedEmail from "./sendPasswordChangedEmail"
import updatePassword from "./updatePassword"

export default async (
  connection: Database,
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
    return Error("Error: Could not check your current password. Please try again.")
  }

  if (!passwordMatch) {
    return Error("Error: Your current password is incorrect.")
  }

  const updatePasswordResult = await updatePassword(connection, emailAddress, newPassword)

  if (isError(updatePasswordResult)) {
    console.error(updatePasswordResult)
    return Error("Error: Could not update password.")
  }

  const sendPasswordChangedEmailResult = await sendPasswordChangedEmail(connection, emailAddress)

  if (isError(sendPasswordChangedEmailResult)) {
    console.error(sendPasswordChangedEmailResult)
  }

  return undefined
}
