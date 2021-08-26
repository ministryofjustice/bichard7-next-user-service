import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import addPasswordHistory from "./addPasswordHistory"
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

  if (getUserResult === null) {
    return Error("Cannot find user")
  }

  const updatePasswordResult = await updatePassword(connection, emailAddress, newPassword)
  if (isError(updatePasswordResult)) {
    return updatePasswordResult
  }

  const addHistoricalPassword = await addPasswordHistory(connection, getUserResult.id, getUserResult.password)
  if (isError(addHistoricalPassword)) {
    return addHistoricalPassword
  }

  return undefined
}
