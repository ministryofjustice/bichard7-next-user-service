import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import UserFullDetails from "types/UserFullDetails"

export default (db: Database, emailAddress: string): PromiseResult<Pick<UserFullDetails, "id" | "password">> => {
  const query = `
      SELECT
        id,
        password
      FROM br7own.users
      WHERE email = \${emailAddress}
        AND deleted_at IS NULL
    `
  return db.one<Pick<UserFullDetails, "id" | "password">>(query, { emailAddress }).catch((error) => error)
}
