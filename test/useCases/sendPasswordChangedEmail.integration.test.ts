import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import User from "types/User"
import getEmailer from "lib/getEmailer"
import sendPasswordChangedEmail from "useCases/sendPasswordChangedEmail"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

jest.mock("lib/getEmailer")

const connection = getConnection()

const user = {
  username: "spce_username",
  emailAddress: "spce_emailAddress",
  exclusionList: "spce_exclusionList",
  inclusionList: "spce_inclusionList",
  endorsedBy: "spce_endorsedBy",
  orgServes: "spce_orgServes",
  forenames: "spce_forenames",
  postalAddress: "spce_postalAddress",
  postCode: "ER3 3RE",
  phoneNumber: "spce_phoneNumber"
} as unknown as User

describe("sendPasswordChangedEmail", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, user.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should send the email when user exists", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    const mockedSendMail = jest.fn().mockResolvedValue(null)
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
    expect(mockedSendMail).toHaveBeenCalledTimes(1)
  })

  it("should not send the email and not return error when user does not exist", async () => {
    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    const mockedSendMail = jest.fn().mockResolvedValue(null)
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
    expect(mockedSendMail).not.toHaveBeenCalled()
  })

  it("should not send email and not return error when user is deleted", async () => {
    await insertDatabaseUser(connection, user, true, "DummyPassword")

    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    const mockedSendMail = jest.fn().mockResolvedValue(null)
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(false)
    expect(mockedSendMail).not.toHaveBeenCalled()
  })

  it("should return error when it fails to send the email", async () => {
    await insertDatabaseUser(connection, user, false, "DummyPassword")

    const expectedError = Error("Expected error message")
    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    // eslint-disable-next-line require-await
    const mockedSendMail = jest.fn().mockImplementation(async () => {
      throw expectedError
    })
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, user.emailAddress)

    expect(isError(result)).toBe(true)

    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })
})
