import authenticate from "useCases/authenticate"
import User from "types/User"
import storeVerificationCode from "useCases/storeVerificationCode"
import { hash } from "lib/shiro"
import { isError } from "types/Result"
import { deleteUser } from "useCases"
import parseFormData from "lib/parseFormData"
import config from "lib/config"
import { createSsha } from "lib/ssha"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import users from "../../testFixtures/database/data/users"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import fakeAuditLogger from "../fakeAuditLogger"
import selectFromTable from "../../testFixtures/database/selectFromTable"

jest.mock("lib/parseFormData")

const correctPassword = "correctPassword"
const invalidPassword = "invalidPassword"

const insertUsers = async (useMigratedPassword = false) => {
  let password: string | null = null
  let migratedPassword: string | null = null

  if (useMigratedPassword) {
    const salt = "aM1B7pQrWYUKFz47XN9Laj=="
    const hashedPassword = await hash(correctPassword, salt, 10)
    password = `$shiro1$SHA-256$10$${salt}$${hashedPassword}`
  } else {
    migratedPassword = createSsha(correctPassword)
  }

  const usersWithPasswords: any[] = users.map((user) => ({
    ...user,
    password,
    migrated_password: migratedPassword
  }))

  await insertIntoTable(usersWithPasswords)
}

describe("Authenticator", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should allow the user to authenticate with correct code and password", async () => {
    await insertUsers()
    const verificationCode = "CoDeRs"
    await storeVerificationCode(connection, "bichard01@example.com", verificationCode)

    const result = await authenticate(
      connection,
      fakeAuditLogger,
      "bichard01@example.com",
      correctPassword,
      verificationCode
    )
    expect(isError(result)).toBe(false)
  })

  it("should not allow the user to authenticate with correct code and incorrect password", async () => {
    await insertUsers()
    const emailAddress = "bichard02@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const result = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and correct password after inserting incorrect password", async () => {
    await insertUsers()
    const emailAddress = "bichard02@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const result = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)

    const isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(false)
  })

  it("should not allow the user to authenticate with incorrect code and correct password", async () => {
    await insertUsers()
    const emailAddress = "bichard03@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, "SoElSe")
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and password only once", async () => {
    await insertUsers()
    const emailAddress = "bichard01@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    let isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(false)

    // wait until config.incorrectDelay seconds have passed
    /* eslint-disable no-useless-escape */
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE email = $\{email\}`,
      { interval: config.incorrectDelay, email: emailAddress }
    )
    /* eslint-disable no-useless-escape */

    // login a second time with same values
    isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate if their account is soft deleted", async () => {
    await insertUsers()
    const emailAddress = "bichard03@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("No data returned from the query.")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
    mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: emailAddress })
    const isDeleted = await deleteUser(connection, fakeAuditLogger, { emailAddress } as User)
    expect(isError(isDeleted)).toBe(false)

    const isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate and migrate password when migrated user is authenticated", async () => {
    await insertUsers(true)
    const verificationCode = "CoDeRs"
    await storeVerificationCode(connection, "bichard01@example.com", verificationCode)

    const result = await authenticate(
      connection,
      fakeAuditLogger,
      "bichard01@example.com",
      correctPassword,
      verificationCode
    )

    expect(isError(result)).toBe(false)

    const selectedUser = await selectFromTable("users", "email", "bichard01@example.com", undefined)

    expect(selectedUser).toHaveLength(1)
    expect(selectedUser[0].password).toBeDefined()
  })
})
