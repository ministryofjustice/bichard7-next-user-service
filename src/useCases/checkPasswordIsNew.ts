import { compare } from "lib/shiro"
import Database from "types/Database"
import { PromiseResult } from "types/Result"
import Task from "types/Task"

const checkPasswordIsNew = async (
  connection: Database | Task,
  userId: number,
  newPassword: string
): PromiseResult<void> => {
  const getAllMatchingPasswords = `
      SELECT 
        password_hash
      FROM br7own.password_history
      WHERE user_id = $1
    `
  try {
    const result = await connection.result(getAllMatchingPasswords, [userId])
    for (let i = 0; i < result.rows.length; i += 1) {
      /* eslint-disable no-await-in-loop */
      const compareResult = await compare(newPassword, result.rows[i].password_hash)
      if (compareResult) {
        return Error("Error: Cannot save previously used password")
      }
    }
  } catch (error) {
    return error
  }

  return undefined
}

export default checkPasswordIsNew
