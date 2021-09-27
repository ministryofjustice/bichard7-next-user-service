import { verifyPassword } from "lib/argon2"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

export default async (db: Database, emailAddress: string, password: string): PromiseResult<boolean> => {
  const query = `
    SELECT password
    FROM br7own.users
    WHERE email = $1 AND deleted_at IS NULL
  `
  const queryResult = await db.one(query, [emailAddress]).catch((error) => error)

  if (isError(queryResult)) {
    console.error(queryResult)
    return queryResult
  }

  const { password: passwordHash } = queryResult as { password: string }
  const result = await verifyPassword(password, passwordHash)

  return result
}
