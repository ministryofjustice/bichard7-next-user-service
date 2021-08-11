import { User } from "types/User"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default (db: Database, username: string): PromiseResult<User | null> => {
  const query = `
      SELECT
        username,
        email AS "emailAddress",
        exclusion_list AS "exclusionList",
        inclusion_list AS "inclusionList",
        endorsed_by AS "endorsedBy",
        org_serves AS "orgServes",
        forenames,
        surname,
        postal_address AS "postalAddress",
        post_code AS "postCode",
        phone_number AS "phoneNumber"
      FROM br7own.users
      WHERE username = $1 AND deleted_at IS NULL
    `
  return db.oneOrNone<User>(query, [username]).catch((error) => error)
}
