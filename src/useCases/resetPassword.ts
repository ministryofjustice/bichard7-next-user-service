import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import addPasswordHistory from "./addPasswordHistory"
import checkPasswordIsNew from "./checkPasswordIsNew"
import getPasswordResetCode from "./getPasswordResetCode"
import getUserLoginDetailsByEmailAddress from "./getUserLoginDetailsByEmailAddress"
import updatePassword from "./updatePassword"

export interface ResetPasswordOptions {
  emailAddress: string
  passwordResetCode: string
  newPassword: string
}

export default async (connection: Database, options: ResetPasswordOptions): PromiseResult<void> => {
  const { emailAddress, passwordResetCode, newPassword } = options

  const userPasswordResetCode = await getPasswordResetCode(connection, emailAddress)
  if (isError(userPasswordResetCode)) {
    return userPasswordResetCode
  }

  if (passwordResetCode !== userPasswordResetCode) {
    return Error("Password reset code does not match")
  }

  const getUserResult = await getUserLoginDetailsByEmailAddress(connection, emailAddress)
  if (isError(getUserResult)) {
    return getUserResult
  }

  return connection
    .task("update-and-store-old-password", async (taskConnection) => {
      const checkPasswordIsNewResult = await checkPasswordIsNew(taskConnection, getUserResult.id, newPassword)
      if (isError(checkPasswordIsNewResult)) {
        return Error("Error: Cannot use previously used password")
      }

      const updatePasswordResult = await updatePassword(taskConnection, emailAddress, newPassword)
      if (isError(updatePasswordResult)) {
        return updatePasswordResult
      }

      const addHistoricalPassword = await addPasswordHistory(taskConnection, getUserResult.id, getUserResult.password)
      if (isError(addHistoricalPassword)) {
        return addHistoricalPassword
      }
      return undefined
    })
    .catch((error) => {
      return error
    })
}
