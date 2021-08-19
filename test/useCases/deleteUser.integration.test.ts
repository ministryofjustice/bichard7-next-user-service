import User from "types/User"
import deleteUser from "useCases/deleteUser"
import getConnection from "lib/getConnection"

const connection = getConnection()

const user = <User>{
  username: "DeleteUserUseCaseTest",
  emailAddress: "DeleteUserUseCaseTest@example.com"
}

const createUser = async (deletedAt: Date | null) => {
  const insertQuery = `
    INSERT INTO br7own.users(
      username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, deleted_at)
      VALUES ($1, $2, true, '-', '-', '-', NOW(), $3);
  `
  await connection.none(insertQuery, [user.username, user.emailAddress, deletedAt])
}

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    const deleteQuery = `
      DELETE FROM br7own.users WHERE username = $1
    `
    await connection.none(deleteQuery, [user.username])
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return deleted response when successfully deletes the user", async () => {
    await createUser(null)
    const result = await deleteUser(connection, user)

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

  it("should not update the deletion date when user is already deleted", async () => {
    const expectedDeletedAt = new Date()
    await createUser(expectedDeletedAt)
    const result = await deleteUser(connection, user)

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

    const actualDeletedAt = new Date(actualUser.deleted_at)
    expect(actualDeletedAt).toEqual(expectedDeletedAt)
  })
})
