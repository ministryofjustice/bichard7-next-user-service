import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import getPasswordResetCode from "./getPasswordResetCode"
import getUserByEmailAddress from "./getUserByEmailAddress"
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

  const getUserResult = await getUserByEmailAddress(connection, emailAddress)
  if (isError(getUserResult)) {
    return getUserResult
  }

  const checkOldPasswordResult = await checkPasswordWasUsedBefore(connection, getUserResult.id)
  if (isError(checkOldPasswordResult)) {
    return checkOldPasswordResult
  }

  const updatePasswordResult = await updatePassword(connection, emailAddress, newPassword)
  if (isError(updatePasswordResult)) {
    return updatePasswordResult
  }

  const addHistoricalPassword = await addPasswordHistory(connection, getUserResult.id, "")
  if (isError(addHistoricalPassword)) {
    return addHistoricalPassword
  }

  return undefined
}
