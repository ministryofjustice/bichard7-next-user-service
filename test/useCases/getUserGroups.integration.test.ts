import { isError } from "types/Result"
import { getUserGroups } from "useCases"
import { UserGroupResult } from "types/UserGroup"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"

describe("getUserGroups", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return groups when groups exists in the database", async () => {
    await insertIntoGroupsTable(groups)

    const groupsResult = (await getUserGroups(connection)) as UserGroupResult[]
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")

    expect(isError(groupsResult)).toBe(false)

    for (let i = 0; i < groupsResult.length; i++) {
      expect(groupsResult[i].id).toBe(selectedGroups[i].id)
      expect(groupsResult[i].name).toBe(selectedGroups[i].name)
    }
  })
})
