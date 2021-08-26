/* eslint-disable import/first */
jest.mock("lib/shiro")

import { createPassword } from "lib/shiro"
import { isError } from "types/Result"
import { resetPassword } from "useCases"
import { ResetPasswordOptions } from "useCases/resetPassword"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import users from "../../testFixtures/database/data/users"

describe("resetPassword", () => {
  let connection: any

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  beforeAll(() => {
    connection = getTestConnection()
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should reset password when password reset code is valid", async () => {
    await insertIntoTable(users)
    const emailAddress = "bichard01@example.com"

    const passwordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, passwordResetCode)

    const expectedPassword = "ExpectedPassword"
    const mockedCreatePassword = createPassword as jest.MockedFunction<typeof createPassword>
    mockedCreatePassword.mockResolvedValue(expectedPassword)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "CreatePasswordMocked",
      passwordResetCode
    }
    const result = await resetPassword(connection, resetPasswordOptions)

    expect(isError(result)).toBe(false)
    expect(result).toBeUndefined()

    const actualUser = await connection.oneOrNone(
      // eslint-disable-next-line no-useless-escape
      `SELECT username, password FROM br7own.users WHERE email = $\{email\}`,
      {
        email: emailAddress
      }
    )

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe("Bichard01")
    expect(actualUser.password).toBe(expectedPassword)
  })

  it("should return error when password reset code is not valid", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    await storePasswordResetCode(connection, emailAddress, "664422")

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "DummyPassword",
      passwordResetCode: "112233"
    }
    const result = await resetPassword(connection, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("Password reset code does not match")
  })

  it("should return error when user does not exist", async () => {
    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: "InvalidEmailAddress",
      newPassword: "DummyPassword",
      passwordResetCode: "DummyCode"
    }
    const result = await resetPassword(connection, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should return error when user is deleted", async () => {
    const deletedUsers = users.map((user) => ({
      ...user,
      deleted_at: new Date()
    }))

    await insertIntoTable(deletedUsers)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: "@example.com",
      newPassword: "DummyPassword",
      passwordResetCode: "DummyCode"
    }
    const result = await resetPassword(connection, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
