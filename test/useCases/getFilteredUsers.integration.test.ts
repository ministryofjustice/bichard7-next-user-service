import User from "types/User"
import { isError } from "types/Result"
import getFilteredUsers from "useCases/getFilteredUsers"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import { Tables } from "../../testFixtures/database/types"
import { users } from "../../testFixtures/database/data/users"

describe("getFilteredUsers", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeAll(async () => {
    await deleteFromTable(Tables.Users)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return correct users from the database", async () => {
    await insertIntoTable(users)
    const result01 = await getFilteredUsers(connection, "")
    expect(isError(result01)).toBe(false)

    const user01List = await selectFromTable(Tables.Users, "email", "bichard01@example.com")
    const user01 = user01List[0]

    const result02 = await getFilteredUsers(connection, "Bichard01")
    expect(isError(result02)).toBe(false)
    expect(result02.length).toBe(1)
    const actualUser01 = <User>result02[0]

    expect(actualUser01.id).toBe(user01.id)

    const user02List = await selectFromTable(Tables.Users, "email", "bichard02@example.com")
    const user02 = user02List[0]

    const result03 = await getFilteredUsers(connection, "bichard02@example.com")
    expect(isError(result03)).toBe(false)
    expect(result03.length).toBe(1)
    const actualUser02 = <User>result03[0]
    expect(actualUser02.id).toBe(user02.id)

    const user03List = await selectFromTable(Tables.Users, "email", "bichard03@example.com")
    const user03 = user03List[0]

    const result04 = await getFilteredUsers(connection, "Surname 03")
    expect(isError(result04)).toBe(false)
    expect(result04.length).toBe(1)
    const actualUser03 = <User>result04[0]
    expect(actualUser03.id).toBe(user03.id)
  })

  it("should not return items that were previously deleted", async () => {
    const filterResult = await getFilteredUsers(connection, "Filter2Surname")
    expect(isError(filterResult)).toBe(false)
    expect(filterResult.length).toBe(0)
  })
})
