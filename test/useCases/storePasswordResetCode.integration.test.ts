import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import User from "types/User"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()

const user = {
  username: "sprrc_username",
  emailAddress: "sprrc_emailAddress",
  exclusionList: "sprrc_exclusionList",
  inclusionList: "sprrc_inclusionList",
  endorsedBy: "sprrc_endorsedBy",
  orgServes: "sprrc_orgServes",
  forenames: "sprrc_forenames",
  postalAddress: "sprrc_postalAddress",
  postCode: "QW2 2WQ",
  phoneNumber: "sprrc_phoneNumber"
} as unknown as User

describe("storePasswordResetCode", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, user.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should store password reset code when user exists", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const expectedPasswordResetCode = "654321"
    const result = await storePasswordResetCode(connection, user.emailAddress, expectedPasswordResetCode)
    expect(isError(result)).toBe(false)

    const actualUser = await connection.oneOrNone(
      `SELECT username, password_reset_code AS "passwordResetCode" FROM br7own.users WHERE email = $1`,
      [user.emailAddress]
    )

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.passwordResetCode).toBe(expectedPasswordResetCode)
  })

  it("should not store password reset code when user is deleted", async () => {
    await insertDatabaseUser(connection, user, true, "DummyPassword")

    const result = await storePasswordResetCode(connection, user.emailAddress, "654321")
    expect(isError(result)).toBe(false)

    const actualUser = await connection.oneOrNone(
      `SELECT username, password_reset_code AS "passwordResetCode" FROM br7own.users WHERE email = $1`,
      [user.emailAddress]
    )

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.passwordResetCode).toBeNull()
  })
})
