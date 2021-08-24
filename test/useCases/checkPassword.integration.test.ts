import getConnection from "lib/getConnection"
import { createPassword } from "lib/shiro"
import User from "types/User"
import checkPassword from "useCases/checkPassword"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()
const password = "TestPassword"

const user = {
  username: "checkp_Username2",
  emailAddress: "checkp_EmailAddress2",
  exclusionList: "checkp_ExclusionList2",
  inclusionList: "checkp_InclusionList2",
  endorsedBy: "checkp_EndorsedBy2",
  orgServes: "checkp_OrgServes2",
  forenames: "checkp_Forenames2",
  postalAddress: "checkp_PostalAddress2",
  postCode: "AC2 2CA",
  phoneNumber: "checkp_PhoneNumber2"
} as unknown as User

describe("checkPassword", () => {
  beforeEach(async () => {
    const passwordHash = await createPassword(password)
    await deleteDatabaseUser(connection, user.username)
    await insertDatabaseUser(connection, user, false, passwordHash)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return true when password is correct", async () => {
    const result = await checkPassword(connection, user.emailAddress, password)

    expect(result).toBe(true)
  })

  it("should return false when password is incorrect", async () => {
    const result = await checkPassword(connection, user.emailAddress, "IncorrectPassword")

    expect(result).toBe(false)
  })
})
