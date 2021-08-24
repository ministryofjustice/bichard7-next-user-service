import User from "types/User"
import { isError } from "types/Result"
import getUserByUsername from "useCases/getUserByUsername"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import { users } from "../../testFixtures/database/data/users"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import { Tables } from "../../testFixtures/database/types"

describe("getUserByUsername", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable(Tables.Users)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertIntoTable(users)

    const user = await getUserByUsername(connection, "Bichard01")
    const expectedUserList: any = await selectFromTable(Tables.Users, "email", "bichard01@example.com")
    const expectedUser = expectedUserList[0]

    expect(isError(user)).toBe(false)

    const actualUser = <User>user
    expect(actualUser.id).toBe(expectedUser.id)
    expect(actualUser.emailAddress).toBe(expectedUser.email)
    expect(actualUser.username).toBe(expectedUser.username)
    expect(actualUser.exclusionList).toBe(expectedUser.exclusion_list)
    expect(actualUser.inclusionList).toBe(expectedUser.inclusion_list)
    expect(actualUser.endorsedBy).toBe(expectedUser.endorsed_by)
    expect(actualUser.orgServes).toBe(expectedUser.org_serves)
    expect(actualUser.forenames).toBe(expectedUser.forenames)
    expect(actualUser.postalAddress).toBe(expectedUser.postal_address)
    expect(actualUser.postCode).toBe(expectedUser.post_code)
    expect(actualUser.phoneNumber).toBe(expectedUser.phone_number)
  })

  it("should return null when user does not exist in the database", async () => {
    const result = await getUserByUsername(connection, "InvalidUsername")
    expect(result).toBeNull()
  })

  it("should return null when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoTable(mappedUsers)

    const result = await getUserByUsername(connection, "incorrectusername")
    expect(result).toBeNull()
  })
})
