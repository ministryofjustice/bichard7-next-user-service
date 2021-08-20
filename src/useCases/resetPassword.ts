import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import getPasswordResetCode from "./getPasswordResetCode"
import passwordSecurityCheck from "./passwordSecurityCheck"
import updatePassword from "./updatePassword"

export interface ResetPasswordOptions {
  emailAddress: string
  passwordResetCode: string
  newPassword: string
}

export default async (connection: Database, options: ResetPasswordOptions): PromiseResult<void> => {
  const { emailAddress, passwordResetCode, newPassword } = options
  const passwordCheckResult = passwordSecurityCheck(newPassword)
  if (isError(passwordCheckResult)) {
    return passwordCheckResult
  }

  const userPasswordResetCode = await getPasswordResetCode(connection, emailAddress)
  if (isError(userPasswordResetCode)) {
    return userPasswordResetCode
  }

  if (passwordResetCode !== userPasswordResetCode) {
    return Error("Password reset code does not match")
  }

  const updatePasswordResult = await updatePassword(connection, emailAddress, newPassword)
  if (isError(updatePasswordResult)) {
    return updatePasswordResult
  }

  return undefined
}
