/* eslint-disable import/first */
jest.mock("lib/parseFormData")

import { IncomingMessage } from "http"
import db from "lib/db"
import { User } from "lib/User"
import parseFormData from "lib/parseFormData"
import deleteUser from "useCases/deleteUser"

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
    await db.none(deleteQuery, [user.username])

    const insertQuery = `
      INSERT INTO br7own.users(
        username, email, active, exclusion_list, inclusion_list, challenge_response, created_at)
        VALUES ($1, $2, true, '-', '-', '-', NOW());
    `
    await db.none(insertQuery, [user.username, user.emailAddress])
  })

  afterAll(() => {
    db.$pool.end()
  })

  it("should return deleted response when successfully deletes the user", async () => {
    const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
    mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: user.username })

    const result = await deleteUser(db, request, user)

    expect(result).toBeDefined()

    const { isDeleted } = result
    expect(isDeleted).toBe(true)

    const actualUser = await db.oneOrNone("SELECT username, deleted_at FROM br7own.users WHERE username = $1", [
      user.username
    ])

    expect(actualUser).toBeDefined()
    expect(actualUser).not.toBeNull()
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.deleted_at).toBeDefined()
    expect(actualUser.deleted_at).not.toBeNull()
  })
})
