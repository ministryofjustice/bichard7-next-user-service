/* eslint-disable import/first */
jest.mock("lib/token/emailVerificationToken")

import createUser from "useCases/createUser"
import createNewUserEmail from "useCases/createNewUserEmail"
import { isError } from "types/Result"
import initialiseUserPassword from "useCases/initialiseUserPassword"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import { generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import EmailContent from "types/EmailContent"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"

const verificationCode = "123456"

const mapUserWithVerficationCode = (usersList: any) =>
  [usersList[0]].map((u) => ({
    ...u,
    password_reset_code: verificationCode
  }))

describe("AccountSetup", () => {
  let connection: any

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should generate the email subject and body to request user to setup password", async () => {
    const mockedGeneratePasswordResetToken = generateEmailVerificationToken as jest.MockedFunction<
      typeof generateEmailVerificationToken
    >
    mockedGeneratePasswordResetToken.mockReturnValue("DUMMY_TOKEN")

    const user = [users[0]].map((u) => ({
      username: u.username,
      forenames: u.forenames,
      emailAddress: u.email,
      endorsedBy: u.endorsed_by,
      surname: u.surname,
      organisation: u.org_serves,
      postCode: u.post_code,
      phoneNumber: u.phone_number,
      postalAddress: u.postal_address
    }))[0]

    const result = await createUser(connection, user)
    expect(isError(result)).toBe(false)

    const passwordSetCodeResult = await storePasswordResetCode(connection, "bichard01@example.com", verificationCode)
    expect(isError(passwordSetCodeResult)).toBe(false)

    const newUserEmailResult = createNewUserEmail(user, verificationCode)
    expect(isError(newUserEmailResult)).toBe(false)

    const email = newUserEmailResult as EmailContent
    expect(email.subject).toMatchSnapshot()
    expect(email.text).toMatchSnapshot()
    expect(email.html).toMatchSnapshot()
  })

  it("should not be able to setup a password if it is too short", async () => {
    await insertIntoTable(users)
    const result = await initialiseUserPassword(connection, "bichard01@example.com", verificationCode, "shorty")
    expect(result).toBeDefined()
    const actualError = <Error>result
    expect(actualError.message).toBe("Password is too short")
  })

  it("should not be able to setup a password if it is banned", async () => {
    await insertIntoTable(users)
    const result = await initialiseUserPassword(connection, "bichard01@example.com", verificationCode, "password")
    expect(result).toBeDefined()
    const actualError = <Error>result
    expect(actualError.message).toBe("Cannot use this password as it is unsecure/banned")
  })

  it("should be able to setup a password using the details from the email", async () => {
    const user = mapUserWithVerficationCode(users)
    await insertIntoTable(user)
    const result = await initialiseUserPassword(connection, "bichard01@example.com", verificationCode, "NewPassword")
    expect(result).toBeUndefined()
  })

  it("should not be able to setup a password a second time using the same details", async () => {
    const user = mapUserWithVerficationCode(users)
    await insertIntoTable(user)

    await initialiseUserPassword(connection, "bichard01@exmaple.com", verificationCode, "NewPassword")

    const secondResult = await initialiseUserPassword(
      connection,
      "bichard01@exmaple.com",
      verificationCode,
      "NewPassword"
    )
    expect(secondResult).toBeDefined()
    const actualError = <Error>secondResult
    expect(actualError.message).toBe("Invalid or expired verification code")
  })
})
