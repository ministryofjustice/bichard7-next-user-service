import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default (db: Database, emailAddress: string): PromiseResult<{ last_logged_in: Date } | null> => {
  const query = `
      SELECT
        last_logged_in
      FROM br7own.users
      WHERE email = $1 AND deleted_at IS NULL
    `
  return db.oneOrNone(query, [emailAddress]).catch((error) => error)
}
