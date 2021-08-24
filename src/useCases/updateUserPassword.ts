import { createPassword } from "lib/shiro"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"

export default async (db: Database, emailAddress: string, password: string): PromiseResult<void> => {
  const passwordHash = await createPassword(password)

  const query = `
      UPDATE br7own.users
      SET password = $1
      WHERE email = $2 AND deleted_at IS NULL
    `

  const result = await db.result(query, [passwordHash, emailAddress]).catch((error) => error)
  if (isError(result)) {
    return result
  }

  return undefined
}
