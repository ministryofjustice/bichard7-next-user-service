import UserCreateDetails from "types/UserDetails"
import createUser from "useCases/createUser"
import User from "types/User"
import getUserByUsername from "useCases/getUserByUsername"
import { isError } from "types/Result"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"

describe("DeleteUserUseCase", () => {
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

  it("should return error when adding a user with the same username as one from the database", async () => {
    insertIntoTable(users)
    const user = users[0]

    const expectedError = new Error(`Error: Username Bichard01 already exists`)

    const createUserDetails: UserCreateDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      organisation: user.org_serves,
      postCode: user.post_code,
      phoneNumber: user.phone_number,
      postalAddress: user.postal_address
    }

    const result = await createUser(connection, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when adding a user with the same email as one from the database", async () => {
    insertIntoTable(users)
    const user = users[0]

    const createUserDetails: UserCreateDetails = {
      username: `${user.username}zyx`,
      forenames: `${user.forenames}xyz`,
      emailAddress: user.email,
      endorsedBy: `${user.endorsed_by}xyz`,
      surname: `${user.surname}xyz`,
      organisation: `${user.org_serves}xyz`,
      postCode: `${user.post_code}xyz`,
      phoneNumber: `${user.phone_number}xyz`,
      postalAddress: `${user.postal_address}xyz`
    }

    const expectedError = new Error(`Error: Email address bichard01@example.com already exists`)
    const result = await createUser(connection, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should be possible to add a user to my force", async () => {
    const user = users[0]

    const createUserDetails: UserCreateDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      organisation: user.org_serves,
      postCode: user.post_code,
      phoneNumber: user.phone_number,
      postalAddress: user.postal_address
    }
    const createResult = await createUser(connection, createUserDetails)
    expect(isError(createResult)).toBe(false)

    const getResult = await getUserByUsername(connection, user.username)
    expect(isError(getResult)).toBe(false)

    const actualUser = <User>getResult
    expect(actualUser.emailAddress).toBe(user.email)
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.endorsedBy).toBe(user.endorsed_by)
    expect(actualUser.orgServes).toBe(user.org_serves)
    expect(actualUser.forenames).toBe(user.forenames)
    expect(actualUser.postalAddress).toBe(user.postal_address)
    expect(actualUser.postCode).toBe(user.post_code)
    expect(actualUser.phoneNumber).toBe(user.phone_number)
  })
})
