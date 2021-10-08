import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import User from "types/User"

export default (db: Database, emailAddress: string): PromiseResult<User | null> => {
  const query = `
      SELECT
        id,
        username,
        email AS "emailAddress",
        exclusion_list AS "exclusionList",
        inclusion_list AS "inclusionList",
        endorsed_by AS "endorsedBy",
        org_serves AS "orgServes",
        forenames,
        surname
      FROM br7own.users
      WHERE email = $1 AND deleted_at IS NULL
    `
  return db.oneOrNone<User>(query, [emailAddress]).catch((error) => error)
}
