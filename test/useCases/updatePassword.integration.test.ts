/* eslint-disable import/first */
jest.mock("lib/shiro")

import getConnection from "lib/getConnection"
import { createPassword } from "lib/shiro"
import { isError } from "types/Result"
import User from "types/User"
import updatePassword from "useCases/updatePassword"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()

const user = {
  username: "up_username",
  emailAddress: "up_emailAddress",
  exclusionList: "up_exclusionList",
  inclusionList: "up_inclusionList",
  endorsedBy: "up_endorsedBy",
  orgServes: "up_orgServes",
  forenames: "up_forenames",
  postalAddress: "up_postalAddress",
  postCode: "QW2 2WQ",
  phoneNumber: "up_phoneNumber"
} as unknown as User

const getUserPassword = () => {
  return connection.oneOrNone(`SELECT username, password FROM br7own.users WHERE email = $1`, [user.emailAddress])
}

describe("updatePassword", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, user.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should update password when user exists", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const expectedPassword = "ExpectedPassword"
    const mockedCreatePassword = createPassword as jest.MockedFunction<typeof createPassword>
    mockedCreatePassword.mockResolvedValue(expectedPassword)

    const result = await updatePassword(connection, user.emailAddress, "CreatePasswordMocked")
    expect(isError(result)).toBe(false)

    const actualUser = await getUserPassword()

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.password).toBe(expectedPassword)
  })

  it("should return error when user is deleted", async () => {
    await insertDatabaseUser(connection, user, true, "DummyPassword")

    const expectedPassword = "ExpectedPassword"
    const result = await updatePassword(connection, user.emailAddress, expectedPassword)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should return error when user does not exist", async () => {
    const expectedPassword = "ExpectedPassword"
    const result = await updatePassword(connection, user.emailAddress, expectedPassword)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
