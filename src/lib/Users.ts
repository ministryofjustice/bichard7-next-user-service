import { ListUsersResult } from "lib/UsersResult"
import db from "lib/db"

export default class Users {
  public static async list(): Promise<ListUsersResult> {
    const query = `
      SELECT
        username,
        forenames,
        surname,
        phone_number,
        email
      FROM br7own.users
    `

    const result = await db.any(query)

    return result.map((row: { [key: string]: string }) => ({
      username: row.username,
      forenames: row.forenames,
      surname: row.surname,
      phoneNumber: row.phone_number,
      emailAddress: row.email
    })) as unknown as ListUsersResult
  }
}
