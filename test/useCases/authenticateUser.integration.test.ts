import authenticate from "useCases/authenticate"
import User from "types/User"
import storeVerificationCode from "useCases/storeVerificationCode"
import { hash } from "lib/shiro"
import { isError } from "types/Result"
import { deleteUser } from "useCases"
import parseFormData from "lib/parseFormData"
import config from "lib/config"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import { Tables } from "../../testFixtures/database/types"
import { users } from "../../testFixtures/database/data/users"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"

jest.mock("lib/parseFormData")

describe("Authenticator", () => {
  const correctPassword = "correctPassword"
  const invalidPassword = "invalidPassword"
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable(Tables.Users)

    const salt = "aM1B7pQrWYUKFz47XN9Laj=="
    const hashedPassword = await hash(correctPassword, salt, 10)

    const usersWithPasswords: any[] = users.map((user) => ({
      ...user,
      password: `$shiro1$SHA-256$10$${salt}$${hashedPassword}`
    }))

    await insertIntoTable(usersWithPasswords)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should allow the user to authenticate with correct code and password", async () => {
    const verificationCode = "CoDeRs"
    await storeVerificationCode(connection, "bichard01@example.com", verificationCode)

    const result = await authenticate(connection, "bichard01@example.com", correctPassword, verificationCode)
    expect(isError(result)).toBe(false)
  })

  it("should not allow the user to authenticate with correct code and incorrect password", async () => {
    const emailAddress = "bichard02@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const result = await authenticate(connection, emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate with incorrect code and correct password", async () => {
    const emailAddress = "bichard03@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const isAuth = await authenticate(connection, emailAddress, correctPassword, "SoElSe")
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and password only once", async () => {
    const emailAddress = "bichard01@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    let isAuth = await authenticate(connection, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(false)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE email = $\{email\}`,
      { interval: config.incorrectDelay, email: emailAddress }
    )

    // login a second time with same values
    isAuth = await authenticate(connection, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate if their account is soft deleted", async () => {
    const emailAddress = "bichard03@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("No data returned from the query.")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
    mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: emailAddress })
    const isDeleted = await deleteUser(connection, { emailAddress } as User)
    expect(isError(isDeleted)).toBe(false)

    const isAuth = await authenticate(connection, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })
})
