import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import UserLoginDetails from "types/UserLoginDetails"

export default (db: Database, emailAddress: string): PromiseResult<UserLoginDetails | null> => {
  const query = `
      SELECT
        username,
        id,
        password,
        email
      FROM br7own.users
      WHERE email = $1 AND deleted_at IS NULL
    `
  return db.oneOrNone<UserLoginDetails>(query, [emailAddress]).catch((error) => error)
}
