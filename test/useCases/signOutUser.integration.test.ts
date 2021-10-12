import { IncomingMessage, ServerResponse } from "http"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { isError } from "types/Result"
import User from "types/User"
import config from "lib/config"
import { signInUser, signOutUser } from "useCases"
import createUser from "useCases/createUser"
import Database from "types/Database"
import groups from "../../testFixtures/database/data/groups"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import users from "../../testFixtures/database/data/users"

describe("SignoutUser", () => {
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

  it("should expire the authentication cookie", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id
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

    const userCreateResult = await createUser(connection, currentUserId, user)
    expect(isError(userCreateResult)).toBe(false)

    const selectedUsers = await selectFromTable("users", "username", user.username)
    const response = new ServerResponse({} as IncomingMessage)
    const authenticationToken = await signInUser(connection, response, selectedUsers[0])
    expect(isError(authenticationToken)).toBe(false)

    expect(authenticationToken).toMatch(/.+\..+\..+/)
    let cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)
    const regex = new RegExp(`${config.authenticationCookieName}=.+; HttpOnly`)
    expect(cookieValues[0]).toMatch(regex)

    const checkDbQuery = `
      SELECT *
      FROM br7own.users
      WHERE username = $\{username\}
        AND jwt_id IS NOT NULL;
    `

    let queryResult = await connection.oneOrNone(checkDbQuery, { username: user.username })
    expect(queryResult).not.toBe(null)

    const cookieResults = { [config.authenticationCookieName]: cookieValues[0].split("=")[1] }
    const request = <IncomingMessage & { cookies: NextApiRequestCookies }>{ method: "GET" }
    request.cookies = cookieResults

    const signoutUserResult = await signOutUser(connection, response, request)
    expect(isError(signoutUserResult)).toBe(false)

    cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)

    queryResult = await connection.none(checkDbQuery, { username: user.username })
    expect(queryResult).toBe(null)
  })
})
