import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default (connection: Database, emailAddress: string): PromiseResult<void> => {
  const query = `
        SELECT
            failed_password_attempts
        FROM br7own.users
        WHERE email = $1 AND deleted_at IS NULL
    `

  return connection.oneOrNone(query, [emailAddress]).catch((error) => error)
}
