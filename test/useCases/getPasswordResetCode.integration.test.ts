import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import User from "types/User"
import getPasswordResetCode from "useCases/getPasswordResetCode"
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

describe("getPasswordResetCode", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, user.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return password reset code when user exists", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const expectedPasswordResetCode = "664422"
    await storePasswordResetCode(connection, user.emailAddress, expectedPasswordResetCode)

    const result = await getPasswordResetCode(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
    expect(result).toBe(expectedPasswordResetCode)
  })

  it("should return error when user does not exist", async () => {
    const expectedPasswordResetCode = "664422"
    await storePasswordResetCode(connection, user.emailAddress, expectedPasswordResetCode)

    const result = await getPasswordResetCode(connection, user.emailAddress)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should return error when user is deleted", async () => {
    await insertDatabaseUser(connection, user, true, "DummyPassword")

    const expectedPasswordResetCode = "664422"
    await storePasswordResetCode(connection, user.emailAddress, expectedPasswordResetCode)

    const result = await getPasswordResetCode(connection, user.emailAddress)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
