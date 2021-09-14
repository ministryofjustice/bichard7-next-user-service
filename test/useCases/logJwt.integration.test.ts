import { logJwt, getUserByUsername } from "useCases"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import insertIntoUsersAndGroupsTable from "../../testFixtures/database/insertIntoUsersAndGroupsTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"

describe("logJwt", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("jwt_ids")
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should store the correct UUID and user Id in the jwt_id table", async () => {
    await insertIntoUsersAndGroupsTable(users, groups)
    const Uuid = "test-value-01"
    const { id } = (await getUserByUsername(connection, "Bichard01")) as any

    const result = await logJwt(connection, id, Uuid)

    expect(result).toBeUndefined()

    const selectedJwtIds = await selectFromTable("jwt_ids")
    const selectedJwt = selectedJwtIds[0]

    expect(selectedJwt.id).toBe(Uuid)
    expect(selectedJwt.user_id).toBe(id)
  })
})
