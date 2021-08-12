import getConnection from "lib/getConnection"
import authenticate from "useCases/authenticate"
import User from "types/User"
import storeVerificationCode from "useCases/storeVerificationCode"
import { hash } from "lib/shiro"
import { isError } from "types/Result"

const expectedUser = {
  username: "DummyUsername",
  emailAddress: "DummyEmailAddress",
  exclusionList: "DummyExclusionList",
  inclusionList: "DummyInclusionList",
  endorsedBy: "DummyEndorsedBy",
  orgServes: "DummyOrgServes",
  forenames: "DummyForenames",
  postalAddress: "DummyPostalAddress",
  postCode: "AB1 1BA",
  phoneNumber: "DummyPhoneNumber"
} as unknown as User

const correctPassword = "correctPassword"
const invalidPassword = "invalidPassword"
const connection = getConnection()

describe("Authenticator", () => {
  beforeAll(async () => {
    const deleteQuery = `DELETE FROM br7own.users WHERE username = $1`
    await connection.none(deleteQuery, [expectedUser.username])

    const insertQuery = `
        INSERT INTO br7own.users(
          username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number, password)
          VALUES ($1, $2, true, $3, $4, '-', NOW(), $5, $6, $7, $8, $9, $10, $11, $12);
        `
    const hashedPassword = await hash(correctPassword, "aM1B7pQrWYUKFz47XN9Laj==", 10)
    await connection.none(insertQuery, [
      expectedUser.username,
      expectedUser.emailAddress,
      expectedUser.exclusionList,
      expectedUser.inclusionList,
      expectedUser.endorsedBy,
      expectedUser.orgServes,
      expectedUser.forenames,
      expectedUser.surname,
      expectedUser.postalAddress,
      expectedUser.postCode,
      expectedUser.phoneNumber,
      `$shiro1$SHA-256$10$aM1B7pQrWYUKFz47XN9Laj==$${hashedPassword}`
    ])
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
})
