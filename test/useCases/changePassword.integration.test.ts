import getConnection from "lib/getConnection"
import { compare, createPassword } from "lib/shiro"
import { isError } from "types/Result"
import User from "types/User"
import { changePassword } from "useCases"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()
const password = "TestPassword"

const user = {
  username: "cpass_Username2",
  emailAddress: "cpass_EmailAddress2",
  exclusionList: "cpass_ExclusionList2",
  inclusionList: "cpass_InclusionList2",
  endorsedBy: "cpass_EndorsedBy2",
  orgServes: "cpass_OrgServes2",
  forenames: "cpass_Forenames2",
  postalAddress: "cpass_PostalAddress2",
  postCode: "AC5 5CA",
  phoneNumber: "cpass_PhoneNumber2"
} as unknown as User

describe("changePassword", () => {
  beforeEach(async () => {
    const passwordHash = await createPassword(password)
    await deleteDatabaseUser(connection, user.username)
    await insertDatabaseUser(connection, user, false, passwordHash)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should change password when current password is correct", async () => {
    const newPassword = "NewPassword"
    const result = await changePassword(connection, user.emailAddress, password, newPassword)

    expect(isError(result)).toBe(false)

    const { password: actualPasswordHash } = (await connection.one(
      "SELECT password FROM br7own.users WHERE email=$1",
      user.emailAddress
    )) as { password: string }

    const passwordMatchResult = await compare(newPassword, actualPasswordHash)

    expect(passwordMatchResult).toBe(true)
  })

  it("should return error when current password is incorrect", async () => {
    const result = await changePassword(connection, user.emailAddress, "IncorrectPassword", "NewPassword")

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("Error: Your current password is incorrect.")
  })
})
