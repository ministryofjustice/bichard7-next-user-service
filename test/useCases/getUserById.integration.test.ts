import getConnection from "lib/getConnection"
import User from "types/User"
import { isError } from "types/Result"
import getUserById from "useCases/getUserById"
import insertDatabaseUser from "./insertDatabaseUser"
import deleteDatabaseUserById from "./deleteDatabaseUserById"

const connection = getConnection()

const expectedUser = {
  id: 1234,
  username: "DummyUsername",
  emailAddress: "DummyEmailAddress",
  endorsedBy: "DummyEndorsedBy",
  orgServes: "DummyOrgServes",
  forenames: "DummyForenames",
  postalAddress: "DummyPostalAddress",
  exclusionList: "exclusionList",
  inclusionList: "inclusionList",
  postCode: "AB1 1BA",
  phoneNumber: "DummyPhoneNumber",
  surname: "DummuSurname"
} as unknown as User

describe("getUserById", () => {
  beforeEach(async () => {
    await deleteDatabaseUserById(connection, expectedUser.id)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertDatabaseUser(connection, expectedUser, false, "")

    const result = await getUserById(connection, expectedUser.id)

    expect(isError(result)).toBe(false)

    const actualUser = <User>result
    expect(actualUser.id).toBe(1234)
    expect(actualUser.emailAddress).toBe(expectedUser.emailAddress)
    expect(actualUser.username).toBe(expectedUser.username)
    expect(actualUser.endorsedBy).toBe(expectedUser.endorsedBy)
    expect(actualUser.orgServes).toBe(expectedUser.orgServes)
    expect(actualUser.forenames).toBe(expectedUser.forenames)
    expect(actualUser.postalAddress).toBe(expectedUser.postalAddress)
    expect(actualUser.postCode).toBe(expectedUser.postCode)
    expect(actualUser.phoneNumber).toBe(expectedUser.phoneNumber)
  })

  it("should return error when user does not exist in the database", async () => {
    const result = await getUserById(connection, 0)

    expect((result as any).message).toBe("No data returned from the query.")
  })

  it("should return error when user is deleted", async () => {
    await insertDatabaseUser(connection, expectedUser, true, "")

    const result = await getUserById(connection, expectedUser.id)

    expect((result as any).message).toBe("No data returned from the query.")
  })
})
