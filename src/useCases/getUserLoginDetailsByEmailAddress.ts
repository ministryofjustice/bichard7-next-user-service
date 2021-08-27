import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import UserLoginDetails from "types/UserLoginDetails"

export default (db: Database, emailAddress: string): PromiseResult<UserLoginDetails> => {
  const query = `
      SELECT
        id,
        password,
        email
      FROM br7own.users
      WHERE email = \${emailAddress}
        AND deleted_at IS NULL
    `
  return db.one<UserLoginDetails>(query, { emailAddress }).catch((error) => error)
}
