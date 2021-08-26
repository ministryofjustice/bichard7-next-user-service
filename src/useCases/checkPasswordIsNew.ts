import { createPassword } from "lib/shiro"
import Database from "types/Database"
import UserDetails from "types/UserDetails"

const checkPasswordIsNew = async (
  connection: Database,
  userId: number,
  newPassword: string
): Promise<Partial<UserDetails>[]> => {
  const newPasswordHash = await createPassword(newPassword)

  const getAllMatchingPasswords = `
      SELECT *
      FROM br7own.password_history
      WHERE user_id = $1
        AND password_hash = $2
    `
  let result = ""
  try {
    result = (await connection.any(getAllMatchingPasswords, [userId, newPasswordHash])).toString()
  } catch (error) {
    return error
  }

  return { result } as any
}

export default checkPasswordIsNew
