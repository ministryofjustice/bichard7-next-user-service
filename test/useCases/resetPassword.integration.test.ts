import { compare, createPassword, hash } from "lib/shiro"
import { isError } from "types/Result"
import { resetPassword } from "useCases"
import { ResetPasswordOptions } from "useCases/resetPassword"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import fakeAuditLogger from "../fakeAuditLogger"

jest.mock("lib/shiro")

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
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const passwordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, passwordResetCode)

    const expectedPassword = "ExpectedPassword"
    const expectedPasswordHash = "$shiro1$SHA-256$500000$Foo==$Bar="
    const mockedCreatePassword = createPassword as jest.MockedFunction<typeof createPassword>
    mockedCreatePassword.mockResolvedValue(expectedPasswordHash)
    const mockedCompare = compare as jest.MockedFunction<typeof compare>
    mockedCompare.mockResolvedValue(false)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "CreateNewPasswordMocked",
      passwordResetCode
    }
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)

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
    expect(actualUser.password).toBe(expectedPasswordHash)
    expect(actualUser.password).not.toBe(expectedPassword)
  })

  it("should return error when new password was used before", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const passwordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, passwordResetCode)

    const expectedResultHash = "SecondTester"
    const hashPassword = hash as jest.MockedFunction<typeof hash>
    hashPassword.mockResolvedValue(expectedResultHash)

    const expectedPasswordHash = "$shiro1$SHA-256$500000$Second==$SecondTester"
    const mockedCreatePassword = createPassword as jest.MockedFunction<typeof createPassword>
    mockedCreatePassword.mockResolvedValue(expectedPasswordHash)

    const mockedCompare = compare as jest.MockedFunction<typeof compare>
    mockedCompare.mockResolvedValue(true)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "CreatePasswordMocked",
      passwordResetCode
    }

    const resetResult = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)
    expect(isError(resetResult)).toBe(false)
    expect(resetResult).not.toBe(undefined)
    expect(resetResult).toBe("Cannot use previously used password")
  })

  it("should return error when new password is not allowed", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const passwordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, passwordResetCode)

    const mockedCompare = compare as jest.MockedFunction<typeof compare>
    mockedCompare.mockResolvedValue(true)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "password",
      passwordResetCode
    }

    const resetResult = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)
    expect(isError(resetResult)).toBe(false)
    expect(resetResult).not.toBe(undefined)
    expect(resetResult).toBe("Cannot use this password as it is insecure/banned")
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
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)

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
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)
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
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
