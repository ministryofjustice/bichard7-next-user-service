import { IncomingMessage, ServerResponse } from "http"
import User from "types/User"
import signInUser from "useCases/signInUser"
import { isError } from "types/Result"
import createUser from "useCases/createUser"
import Database from "types/Database"
import hasUserBeenInactive from "useCases/hasUserBeenInactive"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import users from "../../testFixtures/database/data/users"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"

describe("SigninUser", () => {
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

  it("should store authentication token in cookies and DB", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id
    const selectedGroup = (await selectFromTable("groups", undefined, undefined, "name"))[0]
    const user = {
      emailAddress: "dummy@dummy.com",
      username: "dummy_username",
      forenames: "dummyF",
      endorsedBy: "dummyE",
      surname: "dummyS",
      orgServes: "dummyO",
      groupId: selectedGroup.id
    } as User

    const userCreateResult = await createUser(connection, currentUserId, user)
    expect(isError(userCreateResult)).toBe(false)

    const selectedUsers = await selectFromTable("users", "username", user.username)
    const response = new ServerResponse({} as IncomingMessage)
    const authenticationToken = await signInUser(connection, response, selectedUsers[0])
    expect(isError(authenticationToken)).toBe(false)
    expect(authenticationToken).toMatch(/.+\..+\..+/)
    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)
    expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)

    const checkDbQuery = `
      SELECT *
      FROM br7own.users
      WHERE username = $\{username\}
        AND jwt_id IS NOT NULL
    `
    const queryResult = await connection.oneOrNone(checkDbQuery, { username: user.username })
    expect(queryResult).not.toBe(null)
    expect(queryResult.last_logged_in).not.toBe(null)

    let isUserInactive = await hasUserBeenInactive({
      emailAddress: user.emailAddress,
      username: user.username,
      id: "",
      exclusionList: [""],
      inclusionList: [""],
      groups: []
    })
    expect(isUserInactive).toBe(false)

    const setLastLogin = `
      UPDATE br7own.users
      SET last_logged_in = NOW() - INTERVAL '600 seconds'
      WHERE username = $\{username\}`
    await connection.none(setLastLogin, { username: user.username })
    isUserInactive = await hasUserBeenInactive({
      emailAddress: user.emailAddress,
      username: user.username,
      id: "",
      exclusionList: [""],
      inclusionList: [""],
      groups: []
    })
    expect(isUserInactive).toBe(true)
  })
})
