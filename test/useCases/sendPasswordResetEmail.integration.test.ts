/* eslint-disable import/first */
jest.mock("useCases/sendEmail")

import { isError } from "types/Result"
import User from "types/User"
import sendEmail from "useCases/sendEmail"
import sendPasswordResetEmail from "useCases/sendPasswordResetEmail"
import getTestConnection from "../../testFixtures/getTestConnection"
// import deleteDatabaseUser from "./deleteDatabaseUser"
// import insertDatabaseUser from "./insertDatabaseUser"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import { Tables } from "../../testFixtures/database/types"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import { users } from "../../testFixtures/database/data/users"

const getSingleUserInArray = (users: any[]) =>
  [users[0]].map((u) => ({
    ...u,
    deleted_at: new Date(),
    password: "somepassword"
  }))

describe("sendPasswordResetEmail", () => {
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

  it("should send the email when user exists", async () => {
    await insertIntoTable(users)

    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue()

    const result = await sendPasswordResetEmail(connection, "bichard01@example.com")
    expect(isError(result)).toBe(false)
  })

  it("should not send the email and not return error when user does not exist", async () => {
    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue(Error("It should not send email"))

    const result = await sendPasswordResetEmail(connection, "bichard01@example.com")

    expect(isError(result)).toBe(false)
  })

  it("should not send email and not return error when user is deleted", async () => {
    const user = [users[0]].map((u) => ({
      ...u,
      deleted_at: new Date(),
      password: "somepassword"
    }))

    await insertIntoTable(user)

    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue(Error("It should not send email"))

    const result = await sendPasswordResetEmail(connection, "bichard01@example.com")

    expect(isError(result)).toBe(false)
  })

  it("should return error when it fails to send the email", async () => {
    const user = [users[0]]
    await insertIntoTable(user)

    const expectedError = Error("Expected error message")
    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue(expectedError)

    const result = await sendPasswordResetEmail(connection, "bichard01@example.com")

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })
})
