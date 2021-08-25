import Database from "types/Database"
import UserDetails from "types/UserDetails"

const addPasswordHistory = async (
  connection: Database,
  userId: number,
  oldPassword: string
): Promise<Partial<UserDetails>[]> => {
  const addPasswordQuery = `
      INSERT INTO br7own.password_history(
        user_id,
        password_Hash,
        last_used
      )
      VALUES (
        $1,
        $2,
        NOW()
      )
    `
  let result = ""
  try {
    result = (await connection.any(addPasswordQuery, [userId, oldPassword])).toString()
  } catch (error) {
    return error
  }

  return { result } as any
}

export default addPasswordHistory