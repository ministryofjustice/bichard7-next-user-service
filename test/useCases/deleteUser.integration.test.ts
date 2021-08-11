/* eslint-disable import/first */
jest.mock("lib/parseFormData")

import { IncomingMessage } from "http"
import { User } from "lib/User"
import parseFormData from "lib/parseFormData"
import deleteUser from "useCases/deleteUser"
import getConnection from "lib/getConnection"

const connection = getConnection()

const user = <User>{
  username: "DeleteUserUseCaseTest",
  emailAddress: "DeleteUserUseCaseTest@example.com"
}
const request = <IncomingMessage>{}

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    const deleteQuery = `
      DELETE FROM br7own.users WHERE username = $1
    `
    await connection.none(deleteQuery, [user.username])

    const insertQuery = `
      INSERT INTO br7own.users(
        username, email, active, exclusion_list, inclusion_list, challenge_response, created_at)
        VALUES ($1, $2, true, '-', '-', '-', NOW());
    `
    await connection.none(insertQuery, [user.username, user.emailAddress])
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return deleted response when successfully deletes the user", async () => {
    const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
    mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: user.username })

    const result = await deleteUser(connection, request, user)

    expect(result).toBeDefined()

    const { isDeleted } = result
    expect(isDeleted).toBe(true)

    const actualUser = await connection.oneOrNone("SELECT username, deleted_at FROM br7own.users WHERE username = $1", [
      user.username
    ])

    expect(actualUser).toBeDefined()
    expect(actualUser).not.toBeNull()
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.deleted_at).toBeDefined()
    expect(actualUser.deleted_at).not.toBeNull()
  })
})
