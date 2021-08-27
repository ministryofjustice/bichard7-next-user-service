import { createPassword } from "lib/shiro"
import Database from "types/Database"
import { PromiseResult } from "types/Result"
import Task from "types/Task"

const checkPasswordIsNew = async (
  connection: Database | Task,
  userId: number,
  newPassword: string
): PromiseResult<void> => {
  const newPasswordHash = await createPassword(newPassword)

  const getAllMatchingPasswords = `
      SELECT *
      FROM br7own.password_history
      WHERE user_id = $1
        AND password_hash = $2
    `
  try {
    await connection.none(getAllMatchingPasswords, [userId, newPasswordHash])
  } catch (error) {
    return error
  }

  return undefined
}

export default checkPasswordIsNew
