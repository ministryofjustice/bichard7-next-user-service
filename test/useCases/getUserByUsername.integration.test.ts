import getConnection from "lib/getConnection"
import User from "types/User"
import { isError } from "types/Result"
import getUserByUsername from "useCases/getUserByUsername"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()

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

describe("getUserByUsername", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, expectedUser.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertDatabaseUser(connection, expectedUser, false, "")

    const result = await getUserByUsername(connection, expectedUser.username)

    expect(isError(result)).toBe(false)

    const actualUser = <User>result
    expect(actualUser.emailAddress).toBe(expectedUser.emailAddress)
    expect(actualUser.username).toBe(expectedUser.username)
    expect(actualUser.exclusionList).toBe(expectedUser.exclusionList)
    expect(actualUser.inclusionList).toBe(expectedUser.inclusionList)
    expect(actualUser.endorsedBy).toBe(expectedUser.endorsedBy)
    expect(actualUser.orgServes).toBe(expectedUser.orgServes)
    expect(actualUser.forenames).toBe(expectedUser.forenames)
    expect(actualUser.postalAddress).toBe(expectedUser.postalAddress)
    expect(actualUser.postCode).toBe(expectedUser.postCode)
    expect(actualUser.phoneNumber).toBe(expectedUser.phoneNumber)
  })

  it("should return null when user does not exist in the database", async () => {
    const result = await getUserByUsername(connection, "InvalidUsername")

    expect(result).toBeNull()
  })

  it("should return null when user is deleted", async () => {
    await insertDatabaseUser(connection, expectedUser, true, "")

    const result = await getUserByUsername(connection, expectedUser.username)

    expect(result).toBeNull()
  })
})
