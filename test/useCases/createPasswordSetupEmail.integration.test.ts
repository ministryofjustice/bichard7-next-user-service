/* eslint-disable import/first */
jest.mock("lib/token/emailVerificationToken")

import User from "types/User"
import UserCreateDetails from "types/UserDetails"
import getConnection from "lib/getConnection"
import createUser from "useCases/createUser"
import createNewUserEmail from "useCases/createNewUserEmail"
import { isError } from "types/Result"
import initialiseUserPassword from "useCases/initialiseUserPassword"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import { generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import deleteDatabaseUser from "./deleteDatabaseUser"
import EmailContent from "types/EmailContent"

const connection = getConnection()

const setupUser = {
  username: "SetupUsername",
  emailAddress: "SetupEmailAddress",
  exclusionList: "SetupExclusionList",
  inclusionList: "SetupInclusionList",
  endorsedBy: "SetupEndorsedBy",
  orgServes: "SetupOrgServes",
  forenames: "SetupForenames",
  postalAddress: "SetupPostalAddress",
  postCode: "AS2 2SA",
  phoneNumber: "SetupPhoneNumber"
} as unknown as User

const verificationCode = "123456"

describe("AccountSetup", () => {
  beforeAll(async () => {
    await deleteDatabaseUser(connection, setupUser.username)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should generate the email subject and body to request user to setup password", async () => {
    const mockedGeneratePasswordResetToken = generateEmailVerificationToken as jest.MockedFunction<
      typeof generateEmailVerificationToken
    >
    mockedGeneratePasswordResetToken.mockReturnValue("DUMMY_TOKEN")

    const createUserDetails: UserCreateDetails = {
      username: setupUser.username,
      forenames: setupUser.forenames,
      emailAddress: setupUser.emailAddress,
      endorsedBy: setupUser.endorsedBy,
      surname: setupUser.surname,
      organisation: setupUser.orgServes,
      postCode: setupUser.postCode,
      phoneNumber: setupUser.phoneNumber,
      postalAddress: setupUser.postalAddress
    }

    const result = await createUser(connection, createUserDetails)
    expect(isError(result)).toBe(false)

    const passwordSetCodeResult = await storePasswordResetCode(
      connection,
      createUserDetails.emailAddress,
      verificationCode
    )
    expect(isError(passwordSetCodeResult)).toBe(false)

    const newUserEmailResult = createNewUserEmail(createUserDetails, verificationCode)
    expect(isError(newUserEmailResult)).toBe(false)

    const email = newUserEmailResult as EmailContent
    expect(email.subject).toMatchSnapshot()
    expect(email.text).toMatchSnapshot()
    expect(email.html).toMatchSnapshot()
  })

  it("should be able to setup a password using the details from the email", async () => {
    const result = await initialiseUserPassword(connection, setupUser.emailAddress, verificationCode, "NewPassword")
    expect(result).toBeUndefined()
  })

  it("should not be able to setup a password a second time using the same details", async () => {
    const secondResult = await initialiseUserPassword(
      connection,
      setupUser.emailAddress,
      verificationCode,
      "NewPassword"
    )
    expect(secondResult).toBeDefined()
    const actualError = <Error>secondResult
    expect(actualError.message).toBe("Error: Invalid or expired verification code")
  })
})
