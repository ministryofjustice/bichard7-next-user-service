import Database from "types/Database"
import { PromiseResult } from "types/Result"

export default async (connection: Database, emailAddress: string, passwordResetCode: string): PromiseResult<void> => {
  const updateUserQuery = `
    UPDATE br7own.users
    SET password_reset_code = $1
    WHERE email = $2 AND deleted_at IS NULL
  `
  const result = await connection.none(updateUserQuery, [passwordResetCode, emailAddress])

  return result ?? undefined
}
