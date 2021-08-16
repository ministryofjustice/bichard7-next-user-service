import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"

export default async (connection: Database, emailAddress: string, passwordResetCode: string): PromiseResult<void> => {
  const updateUserQuery = `
    UPDATE br7own.users
    SET password_reset_code = $1
    WHERE email = $2 AND deleted_at IS NULL
  `
  const result = await connection.result(updateUserQuery, [passwordResetCode, emailAddress]).catch((error) => error)

  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("User not found")
  }

  return undefined
}
