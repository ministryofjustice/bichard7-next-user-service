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

  public static async isUsernameUnique(username: string): Promise<string> {
    const query = `SELECT COUNT(1) FROM br7own.users WHERE username = LOWER('${username}')`
    const result = await db.any(query)
    return !(result.length === 1 && result[0].count === "1") ? "" : "Username already exists"
  }

  public static async isEmailUnique(email: string): Promise<string> {
    const query = `SELECT COUNT(1) FROM br7own.users WHERE email = LOWER('${email}')`
    const result = await db.any(query)
    return !(result.length === 1 && result[0].count === "1") ? "" : "Email address already exists"
  }

  public static async create(
    username: string,
    forenames: string,
    surname: string,
    phoneNumber: string,
    emailAddress: string
  ): Promise<string> {
    let result = await this.isUsernameUnique(username)
    if (result.length === 0) {
      return result
    }
    result = await this.isEmailUnique(emailAddress)
    if (result.length === 0) {
      return result
    }

    const query = `
      INSERT INTO br7own.users(
        username,
        forenames,
        surname,
        phone_number,
        email,
        active,
        exclusion_list,
        inclusion_list,
        challenge_response
      )
      VALUES (
        '${username}',
        '${forenames}',
        '${surname}',
        '${phoneNumber}',
        '${emailAddress}',
        true,
        '',
        '',
        ''
      )
    `
    try {
      result = (await db.any(query)).toString()
    } catch (e) {
      result = "Failed to add user"
    }

    return result
  }
}
