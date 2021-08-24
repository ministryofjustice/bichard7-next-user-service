import deleteUser from "useCases/deleteUser"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import { Tables } from "../../testFixtures/database/types"
import { users } from "../../testFixtures/database/data/users"

describe("DeleteUserUseCase", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable(Tables.Users)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return deleted response when successfully deletes the user", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)
    const result = await deleteUser(connection, { emailAddress } as any)

    expect(result).toBeDefined()

    const { isDeleted } = result
    expect(isDeleted).toBe(true)

    const actualUserList = await selectFromTable(Tables.Users, "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser).not.toBeNull()
    expect(actualUser.username).toBe("Bichard01")
    expect(actualUser.deleted_at).toBeDefined()
    expect(actualUser.deleted_at).not.toBeNull()
  })

  it("should not update the deletion date when user is already deleted", async () => {
    const emailAddress = "bichard01@example.com"
    const deletedDate = new Date()

    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: deletedDate
    }))

    await insertIntoTable(mappedUsers)
    const result = await deleteUser(connection, { emailAddress } as any)

    expect(result).toBeDefined()

    const { isDeleted } = result
    expect(isDeleted).toBe(true)

    const actualUserList = await selectFromTable(Tables.Users, "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser).not.toBeNull()
    expect(actualUser.username).toBe("Bichard01")
    expect(actualUser.deleted_at).toBeDefined()

    const actualDeletedAt = new Date(actualUser.deleted_at)
    expect(actualDeletedAt).toEqual(deletedDate)
  })
})
