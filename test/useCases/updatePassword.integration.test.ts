/* eslint-disable import/first */
jest.mock("lib/shiro")

import { createPassword } from "lib/shiro"
import { isError } from "types/Result"
import updatePassword from "useCases/updatePassword"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import { Tables } from "../../testFixtures/database/types"
import { users } from "../../testFixtures/database/data/users"

describe("updatePassword", () => {
  let connection: any

  beforeEach(async () => {
    await deleteFromTable(Tables.Users)
  })

  beforeAll(() => {
    connection = getTestConnection()
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should update password when user exists", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const expectedPassword = "ExpectedPassword"
    const mockedCreatePassword = createPassword as jest.MockedFunction<typeof createPassword>
    mockedCreatePassword.mockResolvedValue(expectedPassword)

    const result = await updatePassword(connection, emailAddress, "CreatePasswordMocked")
    expect(isError(result)).toBe(false)

    const actualUserList = await selectFromTable(Tables.Users, "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe("Bichard01")
    expect(actualUser.password).toBe(expectedPassword)
  })

  it("should return error when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoTable(mappedUsers)

    const expectedPassword = "ExpectedPassword"
    const result = await updatePassword(connection, "bichard01@example.com", expectedPassword)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should return error when user does not exist", async () => {
    await insertIntoTable(users)
    const expectedPassword = "ExpectedPassword"
    const result = await updatePassword(connection, "incorrectemail@address.com", expectedPassword)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
