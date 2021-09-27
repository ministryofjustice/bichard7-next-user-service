import { IncomingMessage, ServerResponse } from "http"
import User from "types/User"
import signInUser from "useCases/signInUser"
import { isError } from "types/Result"
import createUser from "useCases/createUser"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"

describe("SigninUser", () => {
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

  /* eslint-disable require-await */
  it("should store authentication token in cookies and DB", async () => {
    await insertIntoGroupsTable(groups)
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const user = {
      emailAddress: "dummy@dummy.com",
      username: "dummy_username",
      forenames: "dummyF",
      endorsedBy: "dummyE",
      surname: "dummyS",
      orgServes: "dummyO",
      groupId: selectedGroups[0].id
    } as User

    const userCreateResult = await createUser(connection, user)
    expect(isError(userCreateResult)).toBe(false)

    const selectedUsers = await selectFromTable("users", undefined, undefined, "username")
    const response = new ServerResponse({} as IncomingMessage)
    const authenticationToken = await signInUser(connection, response, selectedUsers[0])
    expect(isError(authenticationToken)).toBe(false)
    expect(authenticationToken).toMatch(/.+\..+\..+/)
    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)
    expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)

    const checkDbQuery = `
      SELECT *
      FROM br7own.jwt_ids
      INNER JOIN br7own.users ON br7own.users.id = br7own.jwt_ids.user_id
      WHERE '${user.username}' = br7own.users.username;
    `
    const queryResult = await connection.one(checkDbQuery)
    expect(queryResult).not.toBe(null)
  })
  /* eslint-disable require-await */
})
