import { isError } from "types/Result"
import Database from "types/Database"
import getServiceMessages from "useCases/getServiceMessages"
import PaginatedResult from "types/PaginatedResult"
import ServiceMessage from "types/ServiceMessage"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoServiceMessagesTable"
import data from "../../testFixtures/database/data/serviceMessages"

describe("getServiceMessages", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeAll(async () => {
    await deleteFromTable("service_messages")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return correct service messages from the database", async () => {
    await insertIntoTable(data)

    const pageOneResult = await getServiceMessages(connection, 0)
    expect(isError(pageOneResult)).toBe(false)

    const pageOne = pageOneResult as PaginatedResult<ServiceMessage[]>

    expect(pageOne.totalElements).toBe(data.length)
    expect(pageOne.result).toHaveLength(5)

    const pageOneItems = pageOne.result
    for (let i = 0; i < pageOneItems.length; i++) {
      expect(pageOneItems[i].message).toBe(`Message ${data.length - i}`)
    }

    const pageTwoResult = await getServiceMessages(connection, 1)
    expect(isError(pageTwoResult)).toBe(false)

    const pageTwo = pageTwoResult as PaginatedResult<ServiceMessage[]>

    expect(pageTwo.totalElements).toBe(data.length)
    expect(pageTwo.result).toHaveLength(5)

    const pageTwoItems = pageTwo.result
    for (let i = 0; i < pageTwoItems.length; i++) {
      expect(pageTwoItems[i].message).toBe(`Message ${data.length - i - 5}`)
    }

    const pageThreeResult = await getServiceMessages(connection, 2)
    expect(isError(pageThreeResult)).toBe(false)

    const pageThree = pageThreeResult as PaginatedResult<ServiceMessage[]>

    expect(pageThree.totalElements).toBe(data.length)
    expect(pageThree.result).toHaveLength(3)

    const pageThreeItems = pageThree.result
    for (let i = 0; i < pageThreeItems.length; i++) {
      expect(pageThreeItems[i].message).toBe(`Message ${data.length - i - 10}`)
    }
  })
})
