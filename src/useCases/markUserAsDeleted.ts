import Database from "types/Database"
import { PromiseResult } from "types/Result"

export default (db: Database, emailAddress: string): PromiseResult<void> => {
  const query = `
      UPDATE br7own.users
      SET deleted_at = NOW()
      WHERE email = $1
    `

  return db.none(query, [emailAddress]).catch((error) => error)
}
