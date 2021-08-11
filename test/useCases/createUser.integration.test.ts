import getConnection from "lib/getConnection"
import UserCreateDetails from "types/UserCreateDetails"
import createUser from "useCases/createUser"
import User from "types/User"
import getUserByUsername from "useCases/getUserByUsername"
import { isError } from "types/Result"
import deleteUser from "./deleteUser"
import insertUser from "./insertUser"

const connection = getConnection()

const previousUser = {
  username: "DummyCreateUsername",
  emailAddress: "DummyCreateEmailAddress",
  exclusionList: "DummyCreateExclusionList",
  inclusionList: "DummyCreateInclusionList",
  endorsedBy: "DummyCreateEndorsedBy",
  orgServes: "DummyCreateOrgServes",
  forenames: "DummyCreateForenames",
  postalAddress: "DummyCreatePostalAddress",
  postCode: "AB1 1BA Create",
  phoneNumber: "DummyCreatePhoneNumber"
} as unknown as User

const newUser = {
  username: "DummyCreateUsername2",
  emailAddress: "DummyCreateEmailAddress2",
  exclusionList: "DummyCreateExclusionList2",
  inclusionList: "DummyCreateInclusionList2",
  endorsedBy: "DummyCreateEndorsedBy2",
  orgServes: "DummyCreateOrgServes2",
  forenames: "DummyCreateForenames2",
  postalAddress: "DummyCreatePostalAddress2",
  postCode: "AB2 2BA Create",
  phoneNumber: "DummyCreatePhoneNumber2"
} as unknown as User

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    await deleteUser(connection, previousUser)
    await insertUser(connection, previousUser, false)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return error when adding a user with the same username as one from the database", async () => {
    const expectedError = new Error(`Error: Username ${previousUser.username} already exists`)
    const createUserDetails: UserCreateDetails = {
      username: previousUser.username,
      forenames: previousUser.forenames,
      emailAddress: previousUser.emailAddress,
      endorsedBy: previousUser.endorsedBy,
      surname: previousUser.surname,
      organisation: previousUser.orgServes,
      postCode: previousUser.postCode,
      phoneNumber: previousUser.phoneNumber,
      postalAddress: previousUser.postalAddress
    }
    const result = await createUser(connection, createUserDetails)
    const actualError = <Error>result.error
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when adding a user with the same email as one from the database", async () => {
    const expectedError = new Error(`Error: Email address ${previousUser.emailAddress} already exists`)
    const createUserDetails: UserCreateDetails = {
      username: "NewCreateUsername",
      forenames: previousUser.forenames,
      emailAddress: previousUser.emailAddress,
      endorsedBy: previousUser.endorsedBy,
      surname: previousUser.surname,
      organisation: previousUser.orgServes,
      postCode: previousUser.postCode,
      phoneNumber: previousUser.phoneNumber,
      postalAddress: previousUser.postalAddress
    }
    const result = await createUser(connection, createUserDetails)
    const actualError = <Error>result.error
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should be possible to add a user to my force", async () => {
    await deleteUser(connection, newUser)
    const expectedError = new Error("")
    const createUserDetails: UserCreateDetails = {
      username: newUser.username,
      forenames: newUser.forenames,
      emailAddress: newUser.emailAddress,
      endorsedBy: newUser.endorsedBy,
      surname: newUser.surname,
      organisation: newUser.orgServes,
      postCode: newUser.postCode,
      phoneNumber: newUser.phoneNumber,
      postalAddress: newUser.postalAddress
    }
    const createResult = await createUser(connection, createUserDetails)
    const actualError = <Error>createResult.error
    expect(actualError.message).toBe(expectedError.message)

    const getResult = await getUserByUsername(connection, newUser.username)
    expect(isError(getResult)).toBe(false)

    const actualUser = <User>getResult
    expect(actualUser.emailAddress).toBe(newUser.emailAddress)
    expect(actualUser.username).toBe(newUser.username)
    expect(actualUser.endorsedBy).toBe(newUser.endorsedBy)
    expect(actualUser.orgServes).toBe(newUser.orgServes)
    expect(actualUser.forenames).toBe(newUser.forenames)
    expect(actualUser.postalAddress).toBe(newUser.postalAddress)
    expect(actualUser.postCode).toBe(newUser.postCode)
    expect(actualUser.phoneNumber).toBe(newUser.phoneNumber)
  })
})
