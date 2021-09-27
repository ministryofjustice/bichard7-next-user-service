import User from "types/User"
import { isError } from "types/Result"
import getUserById from "useCases/getUserById"
import createUser from "useCases/createUser"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"

describe("getUserById", () => {
  let connection: Database

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
    await insertIntoGroupsTable(groups)
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroupId = selectedGroups[0].id
    const user = users[0] as any
    ;(user as any).groupId = selectedGroupId

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroupId
    }

    await createUser(connection, createUserDetails)

    const selectedUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const selectedUser = selectedUserList[0]
    const userResult = await getUserById(connection, selectedUser.id)

    expect(isError(userResult)).toBe(false)

    const actualUser = <User>userResult
    expect(actualUser.id).toBe(selectedUser.id)
    expect(actualUser.emailAddress).toBe(selectedUser.email)
    expect(actualUser.username).toBe(selectedUser.username)
    expect(actualUser.endorsedBy).toBe(selectedUser.endorsed_by)
    expect(actualUser.orgServes).toBe(selectedUser.org_serves)
    expect(actualUser.forenames).toBe(selectedUser.forenames)
  })

  it("should return error when user does not exist in the database", async () => {
    const result = await getUserById(connection, 0)
    expect((result as Error).message).toBe("No data returned from the query.")
  })

  it("should return error when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoUsersTable(mappedUsers)
    const usersList = await selectFromTable("users", "email", "bichard01@example.com")
    const user = usersList[0]
    const result = await getUserById(connection, user.id)
    expect((result as Error).message).toBe("No data returned from the query.")
  })

  it("should return the correct group for the user", async () => {
    await insertIntoGroupsTable(groups)
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroupId = selectedGroups[0].id
    const user = users[0]
    ;(user as any).groupId = selectedGroupId

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroupId
    }

    await createUser(connection, createUserDetails)
    const selectedUsers = await selectFromTable("users", "email", user.email)
    const selectedUserId = selectedUsers[0].id
    const userResult = await getUserById(connection, selectedUserId)

    expect(isError(userResult)).toBe(false)
    expect((userResult as any).groupId).toBe(selectedGroupId)
  })
})
