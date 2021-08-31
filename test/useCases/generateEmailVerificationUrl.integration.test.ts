import { generateEmailVerificationUrl } from "useCases"
import Database from "types/Database"
import { isError } from "types/Result"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import users from "../../testFixtures/database/data/users"
import selectFromTable from "../../testFixtures/database/selectFromTable"

describe("getPasswordResetCode", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("generate email verification URL", async () => {
    await insertIntoTable(users)
    const emailAddress = "bichard01@example.com"
    const result = await generateEmailVerificationUrl(connection, emailAddress, "http://dummy.com")

    expect(isError(result)).toBe(false)

    const url = <URL>result
    expect(url.href).toMatch(/http:\/\/localhost:3000\/login\/verify\?token=.+&redirect=http%3A%2F%2Fdummy.com/)

    const actualUserList = await selectFromTable("users", "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser.email_verification_code).toBeDefined()
  })
})
