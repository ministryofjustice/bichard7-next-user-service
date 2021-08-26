import User from "types/User"
import { isError } from "types/Result"
import getUserById from "useCases/getUserById"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import users from "../../testFixtures/database/data/users"
import selectFromTable from "../../testFixtures/database/selectFromTable"

describe("getUserById", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertIntoTable(users)

    const selectedUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const selectedUser = selectedUserList[0]
    const user = await getUserById(connection, selectedUser.id)

    expect(isError(user)).toBe(false)

    const actualUser = <User>user
    expect(actualUser.id).toBe(selectedUser.id)
    expect(actualUser.emailAddress).toBe(selectedUser.email)
    expect(actualUser.username).toBe(selectedUser.username)
    expect(actualUser.endorsedBy).toBe(selectedUser.endorsed_by)
    expect(actualUser.orgServes).toBe(selectedUser.org_serves)
    expect(actualUser.forenames).toBe(selectedUser.forenames)
    expect(actualUser.postalAddress).toBe(selectedUser.postal_address)
    expect(actualUser.postCode).toBe(selectedUser.post_code)
    expect(actualUser.phoneNumber).toBe(selectedUser.phone_number)
  })

  it("should return error when user does not exist in the database", async () => {
    const result = await getUserById(connection, 0)
    expect((result as any).message).toBe("No data returned from the query.")
  })

  it("should return error when user is deleted", async () => {
    const result = await getUserById(connection, 0)
    expect((result as any).message).toBe("No data returned from the query.")
  })
})
