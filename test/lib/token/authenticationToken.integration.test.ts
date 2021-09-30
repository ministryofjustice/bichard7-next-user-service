import { v4 as uuidv4 } from "uuid"
import { getUserByUsername } from "useCases"
import { storeTokenId } from "lib/token/authenticationToken"
import Database from "types/Database"
import User from "types/User"
import getTestConnection from "../../../testFixtures/getTestConnection"
import deleteFromTable from "../../../testFixtures/database/deleteFromTable"
import selectFromTable from "../../../testFixtures/database/selectFromTable"
import insertIntoUsersAndGroupsTable from "../../../testFixtures/database/insertIntoUsersAndGroupsTable"
import users from "../../../testFixtures/database/data/users"
import groups from "../../../testFixtures/database/data/groups"

describe("storeTokenId()", () => {
  let connection: Database

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
    const tokenId = uuidv4()
    const user = (await getUserByUsername(connection, "Bichard01")) as User

    const result = await storeTokenId(connection, user.id, tokenId)
    expect(result).toBeUndefined()

    const selectedJwtIds = await selectFromTable("jwt_ids")
    const selectedJwt = selectedJwtIds[0]

    expect(selectedJwt.id).toBe(tokenId)
    expect(selectedJwt.user_id).toBe(user.id)
  })
})
