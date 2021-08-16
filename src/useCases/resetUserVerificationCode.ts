import Database from "types/Database"
import { PromiseResult } from "types/Result"

const resetUserVerificationCode = async (connection: Database, emailAddress: string): PromiseResult<void> => {
  const updateUserQuery = `
        UPDATE br7own.users
        SET email_verification_code = NULL
        WHERE email = $1
      `

  const result = await connection.none(updateUserQuery, [emailAddress]).catch((error) => error)
  return result
}

export default resetUserVerificationCode
