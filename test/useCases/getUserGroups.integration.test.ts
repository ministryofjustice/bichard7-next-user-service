import { isError } from "types/Result"
import { getUserGroups } from "useCases"
import { UserGroupResult } from "types/UserGroup"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"

describe("getUserGroups", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return groups when groups exists in the database", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const { username } = (await selectFromTable("users", "username", "Bichard01"))[0]

    const groupsResult = (await getUserGroups(connection, [username])) as UserGroupResult[]
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")

    expect(isError(groupsResult)).toBe(false)
    expect(groupsResult.length).toBe(selectedGroups.length)

    for (let i = 0; i < groupsResult.length; i++) {
      expect(groupsResult[i].id).toBe(selectedGroups[i].id)
      expect(groupsResult[i].name).toBe(selectedGroups[i].name)
    }
  })
})
