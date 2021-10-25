import Database from "types/Database"
import Task from "types/Task"
import { isError } from "types/Result"
import PromiseResult from "types/PromiseResult"

export default async (connection: Database | Task, emailAddress: string): PromiseResult<void> => {
  const updateUserQuery = `
    UPDATE br7own.users
    SET last_logged_in = NOW()
    WHERE email = \${emailAddress}
      AND deleted_at IS NULL
  `
  const result = await connection.result(updateUserQuery, { emailAddress }).catch((error) => error)

  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("User not found.")
  }

  return undefined
}
