import getConnection from "lib/getConnection"
import UserCreateDetails from "types/UserDetails"
import createUser from "useCases/createUser"
import User from "types/User"
import getUserByUsername from "useCases/getUserByUsername"
import { isError } from "types/Result"
import deleteDatabaseUser from "./deleteDatabaseUser"
import insertDatabaseUser from "./insertDatabaseUser"

const connection = getConnection()

const previousUser = {
  username: "CreateUsername",
  emailAddress: "CreateEmailAddress",
  exclusionList: "CreateExclusionList",
  inclusionList: "CreateInclusionList",
  endorsedBy: "CreateEndorsedBy",
  orgServes: "CreateOrgServes",
  forenames: "CreateForenames",
  postalAddress: "CreatePostalAddress",
  postCode: "AC1 1CA",
  phoneNumber: "CreatePhoneNumber"
} as unknown as User

const newUser = {
  username: "CreateUsername2",
  emailAddress: "CreateEmailAddress2",
  exclusionList: "CreateExclusionList2",
  inclusionList: "CreateInclusionList2",
  endorsedBy: "CreateEndorsedBy2",
  orgServes: "CreateOrgServes2",
  forenames: "CreateForenames2",
  postalAddress: "CreatePostalAddress2",
  postCode: "AC2 2CA",
  phoneNumber: "CreatePhoneNumber2"
} as unknown as User

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    await deleteDatabaseUser(connection, previousUser.username)
    await await insertDatabaseUser(connection, previousUser, false, "")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return error when adding a user with the same username as one from the database", async () => {
    const expectedError = new Error(`Error: Username ${previousUser.username} already exists`)
    const createUserDetails: UserCreateDetails = {
      username: previousUser.username,
      forenames: newUser.forenames,
      emailAddress: newUser.emailAddress,
      endorsedBy: newUser.endorsedBy,
      surname: newUser.surname,
      organisation: newUser.orgServes,
      postCode: newUser.postCode,
      phoneNumber: newUser.phoneNumber,
      postalAddress: newUser.postalAddress
    }
    const result = await createUser(connection, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
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
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should be possible to add a user to my force", async () => {
    await deleteDatabaseUser(connection, newUser.username)
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
    expect(isError(createResult)).toBe(false)

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
