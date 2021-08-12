import getConnection from "lib/getConnection"
import authenticate from "useCases/authenticate"
import User from "types/User"
import storeVerificationCode from "useCases/storeVerificationCode"
import { hash } from "lib/shiro"
import { isError } from "types/Result"
import { deleteUser } from "useCases"
import { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import dbDeleteUser from "./dbDeleteUser"
import dbInsertUser from "./dbInsertUser"

jest.mock("lib/parseFormData")

const expectedUser = {
  username: "AuthUsername",
  emailAddress: "AuthEmailAddress",
  exclusionList: "AuthExclusionList",
  inclusionList: "AuthInclusionList",
  endorsedBy: "AuthEndorsedBy",
  orgServes: "AuthOrgServes",
  forenames: "AuthForenames",
  postalAddress: "AuthPostalAddress",
  postCode: "AA1 1AA",
  phoneNumber: "AuthPhoneNumber"
} as unknown as User

const correctPassword = "correctPassword"
const invalidPassword = "invalidPassword"
const connection = getConnection()

describe("Authenticator", () => {
  beforeAll(async () => {
    await dbDeleteUser(connection, expectedUser.username)
    const salt = "aM1B7pQrWYUKFz47XN9Laj=="
    const hashedPassword = await hash(correctPassword, salt, 10)
    dbInsertUser(connection, expectedUser, false, `$shiro1$SHA-256$10$${salt}$${hashedPassword}`)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should allow the user to authenticate with correct code and password", async () => {
    const verificationCode = "CoDeRs"
    storeVerificationCode(connection, expectedUser.emailAddress, verificationCode)

    const result = await authenticate(connection, expectedUser.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(false)
  })

  it("should not allow the user to authenticate with correct code and incorrect password", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    storeVerificationCode(connection, expectedUser.emailAddress, verificationCode)

    const result = await authenticate(connection, expectedUser.emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate with incorrect code and correct password", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    storeVerificationCode(connection, expectedUser.emailAddress, verificationCode)

    const result = await authenticate(connection, expectedUser.emailAddress, correctPassword, "SoElSe")
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and password only once", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    storeVerificationCode(connection, expectedUser.emailAddress, verificationCode)

    let result = await authenticate(connection, expectedUser.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(false)
    // login a second time with same logic
    result = await authenticate(connection, expectedUser.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow the user to authenticate if their account is soft deleted", async () => {
    const verificationCode = "CoDeRs"
    const expectedError = new Error("No data returned from the query.")
    storeVerificationCode(connection, expectedUser.emailAddress, verificationCode)

    const request = <IncomingMessage>{}
    const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
    mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: expectedUser.username })
    let result = await deleteUser(connection, request, expectedUser)
    expect(isError(result)).toBe(false)

    result = await authenticate(connection, expectedUser.emailAddress, correctPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })
})
