/* eslint-disable import/first */
jest.mock("useCases/sendEmail")

import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import User from "types/User"
import sendEmail from "useCases/sendEmail"
import sendPasswordResetEmail from "useCases/sendPasswordResetEmail"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()

const user = {
  username: "spre_username",
  emailAddress: "spre_emailAddress",
  exclusionList: "spre_exclusionList",
  inclusionList: "spre_inclusionList",
  endorsedBy: "spre_endorsedBy",
  orgServes: "spre_orgServes",
  forenames: "spre_forenames",
  postalAddress: "spre_postalAddress",
  postCode: "QW2 2WQ",
  phoneNumber: "spre_phoneNumber"
} as unknown as User

describe("sendPasswordResetEmail", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, user.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should send the email when user exists", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue()

    const result = await sendPasswordResetEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
  })

  it("should not send the email and not return error when user does not exist", async () => {
    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue(Error("It should not send email"))

    const result = await sendPasswordResetEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
  })

  it("should not send email and not return error when user is deleted", async () => {
    await insertDatabaseUser(connection, user, true, "DummyPassword")

    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue(Error("It should not send email"))

    const result = await sendPasswordResetEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
  })

  it("should return error when it fails to send the email", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const expectedError = Error("Expected error message")
    const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>
    mockedSendEmail.mockResolvedValue(expectedError)

    const result = await sendPasswordResetEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })
})
