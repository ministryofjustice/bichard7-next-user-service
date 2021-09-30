import { isError } from "types/Result"
import config from "lib/config"
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
    expect(pageOne.result).toHaveLength(config.maxServiceMessagesPerPage)

    const pageOneItems = pageOne.result
    for (let i = 0; i < pageOneItems.length; i++) {
      expect(pageOneItems[i].message).toBe(`Message ${i + 1}`)
    }

    const pageTwo = pageOneResult as PaginatedResult<ServiceMessage[]>

    expect(pageTwo.totalElements).toBe(data.length)
    expect(pageTwo.result).toHaveLength(config.maxServiceMessagesPerPage)

    const pageTwoItems = pageTwo.result
    for (let i = 0; i < pageTwoItems.length; i++) {
      expect(pageTwoItems[i].message).toBe(`Message ${i + 6}`)
    }
  })
})
