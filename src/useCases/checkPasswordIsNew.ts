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
    const filteredResults = (await connection.result(getAllMatchingPasswords, [userId])).rows.map((row) =>
      compare(newPassword, row.password_hash)
    )
    const comparedResults = await Promise.all(filteredResults)

    if (comparedResults.some((item) => item === true)) {
      return Error("Cannot save previously used password")
    }
  } catch (error) {
    return error
  }

  return undefined
}

export default checkPasswordIsNew