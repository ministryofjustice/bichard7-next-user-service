import config from "lib/config"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default async (db: Database, emailAddress: string): PromiseResult<{ last_logged_in: Date } | null> => {
  const query = `
      SELECT
        last_logged_in
      FROM br7own.users
      WHERE email = $1
        AND last_logged_in > NOW() - INTERVAL '$2 seconds'
        AND deleted_at IS NULL
    `

  try {
    return await db.oneOrNone(query, [emailAddress, config.timeoutInactivity * 60]).catch((error) => error)
  } catch (error) {
    return error as Error
  }
}
