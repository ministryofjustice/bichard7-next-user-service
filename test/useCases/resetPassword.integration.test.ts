/* eslint-disable import/first */
jest.mock("lib/shiro")

import getConnection from "lib/getConnection"
import { createPassword } from "lib/shiro"
import { isError } from "types/Result"
import User from "types/User"
import { resetPassword } from "useCases"
import getPasswordResetCode from "useCases/getPasswordResetCode"
import { ResetPasswordOptions } from "useCases/resetPassword"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()

const user = {
  username: "gprc_username",
  emailAddress: "gprc_emailAddress",
  exclusionList: "gprc_exclusionList",
  inclusionList: "gprc_inclusionList",
  endorsedBy: "gprc_endorsedBy",
  orgServes: "gprc_orgServes",
  forenames: "gprc_forenames",
  postalAddress: "gprc_postalAddress",
  postCode: "QW2 2WQ",
  phoneNumber: "gprc_phoneNumber"
} as unknown as User

describe("resetPassword", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, user.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should reset password when password reset code is valid", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const passwordResetCode = "664422"
    await storePasswordResetCode(connection, user.emailAddress, passwordResetCode)

    const expectedPassword = "ExpectedPassword"
    const mockedCreatePassword = createPassword as jest.MockedFunction<typeof createPassword>
    mockedCreatePassword.mockResolvedValue(expectedPassword)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: user.emailAddress,
      newPassword: "CreatePasswordMocked",
      passwordResetCode
    }
    const result = await resetPassword(connection, resetPasswordOptions)

    expect(isError(result)).toBe(false)
    expect(result).toBeUndefined()

    const actualUser = await connection.oneOrNone(`SELECT username, password FROM br7own.users WHERE email = $1`, [
      user.emailAddress
    ])

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.password).toBe(expectedPassword)
  })

  it("should return error when password reset code is not valid", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    await storePasswordResetCode(connection, user.emailAddress, "664422")

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: user.emailAddress,
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
    await insertDatabaseUser(connection, user, true, "DummyPassword")

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: user.emailAddress,
      newPassword: "DummyPassword",
      passwordResetCode: "DummyCode"
    }
    const result = await resetPassword(connection, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
