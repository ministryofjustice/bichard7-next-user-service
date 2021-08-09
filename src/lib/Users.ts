import { ListUsersResult, CreateUserResult } from "lib/UsersResult"
import db from "lib/db"

const CheckName = "Pre-create user check"

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

  public static async isUsernameUnique(username: string): Promise<Error> {
    const query = `SELECT COUNT(1) FROM br7own.users WHERE LOWER(username) = LOWER('${username}')`
    const result = await db.any(query)
    return !(result.length === 1 && result[0].count === "1")
      ? { name: CheckName, message: "" }
      : { name: CheckName, message: `Error: Username ${username} already exists` }
  }

  public static async isEmailUnique(email: string): Promise<Error> {
    const query = `SELECT COUNT(1) FROM br7own.users WHERE LOWER(email) = LOWER('${email}')`
    const result = await db.any(query)
    return !(result.length === 1 && result[0].count === "1")
      ? { name: CheckName, message: "" }
      : { name: CheckName, message: `Error: Email address ${email} already exists` }
  }

  public static async create(
    username: string,
    forenames: string,
    surname: string,
    phoneNumber: string,
    emailAddress: string
  ): Promise<CreateUserResult> {
    let checkData = await this.isUsernameUnique(username)
    if (checkData.message !== "") {
      return { result: "", error: checkData }
    }
    checkData = await this.isEmailUnique(emailAddress)
    if (checkData.message !== "") {
      return { result: "", error: checkData }
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
    let errorMessage = ""
    let result = ""
    try {
      result = (await db.any(query)).toString()
    } catch (e) {
      errorMessage = "Error: Failed to add user"
    }

    return { result, error: { name: "Failed Add User", message: errorMessage } }
  }
}
