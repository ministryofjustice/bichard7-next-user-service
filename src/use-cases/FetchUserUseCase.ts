import { User } from "lib/User"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default class FetchUserUseCase {
  private readonly query = `
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
      phone_number AS "phoneNumber",
      password,
      email_verification_code AS "emailVerificationCode"
    FROM br7own.users
    WHERE username = $1 AND deleted_at IS NULL
  `

  constructor(private db: Database) {}

  async fetch(username: string): PromiseResult<User | null> {
    const result = await this.db.oneOrNone<User>(this.query, [username]).catch((error) => error)

    return result
  }
}
