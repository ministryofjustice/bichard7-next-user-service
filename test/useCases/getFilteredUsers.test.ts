import getConnection from "lib/getConnection"
import User from "types/User"
import { isError } from "types/Result"
import getFilteredUsers from "useCases/getFilteredUsers"
import insertDatabaseUser from "./insertDatabaseUser"
import deleteDatabaseUserById from "./deleteDatabaseUserById"

const connection = getConnection()

const user1 = {
  id: 12341,
  username: "Filter1Username",
  emailAddress: "Filter1EmailAddress",
  endorsedBy: "Filter1EndorsedBy",
  orgServes: "Filter1OrgServes",
  forenames: "Filter1Forenames",
  postalAddress: "Filter1PostalAddress",
  exclusionList: "exclusionList",
  inclusionList: "inclusionList",
  postCode: "AB1 1BA",
  phoneNumber: "Filter1PhoneNumber",
  surname: "Filter1Surname"
} as unknown as User

const user2 = {
  id: 12342,
  username: "Filter2Username",
  emailAddress: "Filter2EmailAddress",
  endorsedBy: "Filter2EndorsedBy",
  orgServes: "Filter2OrgServes",
  forenames: "Filter2Forenames",
  postalAddress: "Filter2PostalAddress",
  exclusionList: "exclusionList",
  inclusionList: "inclusionList",
  postCode: "AB1 1BA",
  phoneNumber: "Filter2PhoneNumber",
  surname: "Filter2Surname"
} as unknown as User

const user3 = {
  id: 12343,
  username: "Filter3Username",
  emailAddress: "Filter3EmailAddress",
  endorsedBy: "Filter3EndorsedBy",
  orgServes: "Filter3OrgServes",
  forenames: "Filter3Forenames",
  postalAddress: "Filter3PostalAddress",
  exclusionList: "exclusionList",
  inclusionList: "inclusionList",
  postCode: "AB1 1BA",
  phoneNumber: "Filter3PhoneNumber",
  surname: "Filter3Surname"
} as unknown as User

describe("getFilteredUsers", () => {
  beforeEach(async () => {
    await deleteDatabaseUserById(connection, user1.id)
    await deleteDatabaseUserById(connection, user2.id)
    await deleteDatabaseUserById(connection, user3.id)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return correct users from the database", async () => {
    await insertDatabaseUser(connection, user1, false, "")
    await insertDatabaseUser(connection, user2, false, "")
    await insertDatabaseUser(connection, user3, false, "")

    let result = await getFilteredUsers(connection, "")
    expect(isError(result)).toBe(false)

    result = await getFilteredUsers(connection, "Filter3Username")
    expect(isError(result)).toBe(false)
    expect(result.length).toBe(1)
    let actualUser = <User>result[0]
    expect(actualUser.id).toBe(12343)

    result = await getFilteredUsers(connection, "Filter1EmailAddress")
    expect(isError(result)).toBe(false)
    expect(result.length).toBe(1)
    actualUser = <User>result[0]
    expect(actualUser.id).toBe(12341)

    result = await getFilteredUsers(connection, "Filter2Surname")
    expect(isError(result)).toBe(false)
    expect(result.length).toBe(1)
    actualUser = <User>result[0]
    expect(actualUser.id).toBe(12342)
  })
})
