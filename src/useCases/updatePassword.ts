import Database from "types/Database"
import Task from "types/Task"
import { isError } from "types/Result"
import { hashPassword } from "lib/argon2"
import PromiseResult from "types/PromiseResult"

export default async (connection: Database | Task, emailAddress: string, newPassword: string): PromiseResult<void> => {
  const password = await hashPassword(newPassword)

  const updateUserQuery = `
    UPDATE br7own.users
    SET password_reset_code = NULL,
    password = \${passwordHash}
    WHERE email = \${emailAddress}
      AND deleted_at IS NULL
  `
  const result = await connection
    .result(updateUserQuery, { passwordHash: password, emailAddress })
    .catch((error) => error)

  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("User not found.")
  }

  return undefined
}
