import Database from "types/Database"
import { PromiseResult } from "types/Result"

export default (db: Database, emailAddress: string, password: string): PromiseResult<void> => {
  const query = `
      UPDATE br7own.users
      SET password = $1
      WHERE email = $2 AND deleted_at IS NULL
    `

  return db.none(query, [password, emailAddress]).catch((error) => error)
}
