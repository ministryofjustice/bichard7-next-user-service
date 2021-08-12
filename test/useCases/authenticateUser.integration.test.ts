import getConnection from "lib/getConnection"
import authenticate from "useCases/authenticate"
import User from "types/User"
import storeVerificationCode from "useCases/storeVerificationCode"
import { hash } from "lib/shiro"
import { isError } from "types/Result"
import { deleteUser } from "useCases"
import { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import config from "lib/config"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

jest.mock("lib/parseFormData")

const expectedUser1 = {
  username: "AuthUsername1",
  emailAddress: "AuthEmailAddress1",
  exclusionList: "AuthExclusionList1",
  inclusionList: "AuthInclusionList1",
  endorsedBy: "AuthEndorsedBy1",
  orgServes: "AuthOrgServes1",
  forenames: "AuthForenames1",
  postalAddress: "AuthPostalAddress1",
  postCode: "AA1 1AA",
  phoneNumber: "AuthPhoneNumber1"
} as unknown as User

const expectedUser2 = {
  username: "AuthUsername2",
  emailAddress: "AuthEmailAddress2",
  exclusionList: "AuthExclusionList2",
  inclusionList: "AuthInclusionList2",
  endorsedBy: "AuthEndorsedBy2",
  orgServes: "AuthOrgServes2",
  forenames: "AuthForenames2",
  postalAddress: "AuthPostalAddress2",
  postCode: "AA2 2AA",
  phoneNumber: "AuthPhoneNumber2"
} as unknown as User

const expectedUser3 = {
  username: "AuthUsername3",
  emailAddress: "AuthEmailAddress3",
  exclusionList: "AuthExclusionList3",
  inclusionList: "AuthInclusionList3",
  endorsedBy: "AuthEndorsedBy3",
  orgServes: "AuthOrgServes3",
  forenames: "AuthForenames3",
  postalAddress: "AuthPostalAddress3",
  postCode: "AA3 3AA",
  phoneNumber: "AuthPhoneNumber3"
} as unknown as User

const expectedUser4 = {
  username: "AuthUsername4",
  emailAddress: "AuthEmailAddress4",
  exclusionList: "AuthExclusionList4",
  inclusionList: "AuthInclusionList4",
  endorsedBy: "AuthEndorsedBy4",
  orgServes: "AuthOrgServes4",
  forenames: "AuthForenames4",
  postalAddress: "AuthPostalAddress4",
  postCode: "AA4 4AA",
  phoneNumber: "AuthPhoneNumber4"
} as unknown as User

const expectedUser5 = {
  username: "AuthUsername5",
  emailAddress: "AuthEmailAddress5",
  exclusionList: "AuthExclusionList5",
  inclusionList: "AuthInclusionList5",
  endorsedBy: "AuthEndorsedBy5",
  orgServes: "AuthOrgServes5",
  forenames: "AuthForenames5",
  postalAddress: "AuthPostalAddress5",
  postCode: "AA5 5AA",
  phoneNumber: "AuthPhoneNumber5"
} as unknown as User

const correctPassword = "correctPassword"
const invalidPassword = "invalidPassword"
const connection = getConnection()

describe("Authenticator", () => {
  beforeAll(async () => {
    await deleteDatabaseUser(connection, expectedUser1.username)
    await deleteDatabaseUser(connection, expectedUser2.username)
    await deleteDatabaseUser(connection, expectedUser3.username)
    await deleteDatabaseUser(connection, expectedUser4.username)
    await deleteDatabaseUser(connection, expectedUser5.username)
    const salt = "aM1B7pQrWYUKFz47XN9Laj=="
    const hashedPassword = await hash(correctPassword, salt, 10)
    await insertDatabaseUser(connection, expectedUser1, false, `$shiro1$SHA-256$10$${salt}$${hashedPassword}`)
    await insertDatabaseUser(connection, expectedUser2, false, `$shiro1$SHA-256$10$${salt}$${hashedPassword}`)
    await insertDatabaseUser(connection, expectedUser3, false, `$shiro1$SHA-256$10$${salt}$${hashedPassword}`)
    await insertDatabaseUser(connection, expectedUser4, false, `$shiro1$SHA-256$10$${salt}$${hashedPassword}`)
    await insertDatabaseUser(connection, expectedUser5, false, `$shiro1$SHA-256$10$${salt}$${hashedPassword}`)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should allow the user to authenticate with correct code and password", async () => {
    const verificationCode = "CoDeRs"
    storeVerificationCode(connection, expectedUser1.emailAddress, verificationCode)

    const result = await authenticate(connection, expectedUser1.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(false)
  })

  it("should not allow the user to authenticate with correct code and incorrect password", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    storeVerificationCode(connection, expectedUser2.emailAddress, verificationCode)

    const result = await authenticate(connection, expectedUser2.emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate with incorrect code and correct password", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    storeVerificationCode(connection, expectedUser3.emailAddress, verificationCode)

    const result = await authenticate(connection, expectedUser3.emailAddress, correctPassword, "SoElSe")
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and password only once", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    storeVerificationCode(connection, expectedUser4.emailAddress, verificationCode)

    let result = await authenticate(connection, expectedUser4.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(false)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$1 seconds'
      WHERE email = $2`,
      [config.incorrectDelay, expectedUser4.emailAddress]
    )

    // login a second time with same logic
    result = await authenticate(connection, expectedUser4.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate if their account is soft deleted", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("No data returned from the query.")
    storeVerificationCode(connection, expectedUser5.emailAddress, verificationCode)

    const request = <IncomingMessage>{}
    const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
    mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: expectedUser5.username })
    let result = await deleteUser(connection, request, expectedUser5)
    expect(isError(result)).toBe(false)

    result = await authenticate(connection, expectedUser5.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })
})
