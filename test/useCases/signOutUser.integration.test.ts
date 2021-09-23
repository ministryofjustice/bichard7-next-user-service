import { IncomingMessage, ServerResponse } from "http"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { isError } from "types/Result"
import User from "types/User"
import config from "lib/config"
import { signInUser, signOutUser } from "useCases"
import createUser from "useCases/createUser"
import groups from "../../testFixtures/database/data/groups"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"

describe("SignoutUser", () => {
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

  /* eslint-disable require-await */
  it("should expire the authentication cookie", async () => {
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
    } as unknown as User

    const userCreateResult = await createUser(connection, user)
    expect(isError(userCreateResult)).toBe(false)

    const selectedUsers = await selectFromTable("users", undefined, undefined, "username")
    const response = new ServerResponse({} as IncomingMessage)
    const authenticationToken = await signInUser(connection, response, selectedUsers[0])
    expect(isError(authenticationToken)).toBe(false)

    expect(authenticationToken).toMatch(/.+\..+\..+/)
    let cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)
    const regex = new RegExp(`${config.authenticationCookieName}=.+..+..+; HttpOnly`)
    expect(cookieValues[0]).toMatch(regex)

    const checkDbQuery = `
      SELECT *
      FROM br7own.jwt_ids
      INNER JOIN br7own.users ON br7own.users.id = br7own.jwt_ids.user_id
      WHERE '${user.username}' = br7own.users.username;
    `

    let queryResult = await connection.one(checkDbQuery)
    expect(queryResult).not.toBe(null)

    const cookieResults = { [config.authenticationCookieName]: cookieValues[0].split("=")[1] }
    const request = <IncomingMessage & { cookies: NextApiRequestCookies }>{ method: "GET" }
    request.cookies = cookieResults

    const signoutUserResult = await signOutUser(connection, response, request)
    expect(isError(signoutUserResult)).toBe(false)

    cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)

    queryResult = await connection.none(checkDbQuery)
    expect(queryResult).toBe(null)
  })
  /* eslint-disable require-await */
})
