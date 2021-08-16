import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"

export default async (connection: Database, emailAddress: string): PromiseResult<string> => {
  const query = `
    SELECT
      password_reset_code AS "passwordResetCode"
    FROM br7own.users
    WHERE email = $1 AND deleted_at IS NULL
  `
  const result = await connection
    .oneOrNone<{ passwordResetCode: string }>(query, [emailAddress])
    .catch((error) => error)

  if (isError(result)) {
    return result
  }

  if (!result) {
    return Error("User not found")
  }

  return result.passwordResetCode
}
