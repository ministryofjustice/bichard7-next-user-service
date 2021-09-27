import UserCreateDetails from "types/UserDetails"
import createUser from "useCases/createUser"
import User from "types/User"
import getUserByUsername from "useCases/getUserByUsername"
import { isError } from "types/Result"
import Database from "types/Database"
import insertIntoUserTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoGroupTable from "../../testFixtures/database/insertIntoGroupsTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"

describe("DeleteUserUseCase", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return error when adding a user with the same username as one from the database", async () => {
    await insertIntoUserTable(users)
    await insertIntoGroupTable(groups)
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]
    const user = users[0]

    const expectedError = new Error(`Username Bichard01 already exists.`)

    const createUserDetails: UserCreateDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroup.group_id
    }

    const result = await createUser(connection, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when adding a user with the same email as one from the database", async () => {
    await insertIntoUserTable(users)
    await insertIntoGroupTable(groups)
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]
    const user = users[0]

    const createUserDetails: UserCreateDetails = {
      username: `${user.username}zyx`,
      forenames: `${user.forenames}xyz`,
      emailAddress: user.email,
      endorsedBy: `${user.endorsed_by}xyz`,
      surname: `${user.surname}xyz`,
      orgServes: `${user.org_serves}xyz`,
      groupId: selectedGroup.group_id
    }

    const expectedError = new Error(`Email address bichard01@example.com already exists.`)
    const result = await createUser(connection, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should be possible to add a user to my force", async () => {
    await insertIntoGroupTable(groups)
    const user = users[0]
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]

    const createUserDetails: UserCreateDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroup.id
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
  })

  it("should add the user to the correct group that exists in the user table", async () => {
    await insertIntoGroupTable(groups)
    const user = users[0]

    const selectedGroups = await selectFromTable("groups", "name", "B7Supervisor_grp")
    const group = selectedGroups[0]

    const createUserDetails: UserCreateDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: group.id
    }

    const createResult = await createUser(connection, createUserDetails)
    expect(isError(createResult)).toBe(false)

    const expectedUsers = await selectFromTable("users", "email", user.email)
    const expectedUser = expectedUsers[0]
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", expectedUser.id)
    const expectedUserGroup = expectedUsersGroups[0]

    expect(expectedUser.id).toBe(expectedUserGroup.user_id)
    expect(group.id).toBe(expectedUserGroup.group_id)
  })

  it("should throw foreign key constraint error when group does not exist in groups table", async () => {
    await insertIntoGroupTable(groups)
    const user = users[0]
    const selectedGroups = await selectFromTable("groups")

    const greatestPossibleIdPlusOne =
      selectedGroups.reduce((a: any, c: any) => {
        return a + c.id
      }, 0) + 1

    const createUserDetails: UserCreateDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: greatestPossibleIdPlusOne
    }

    const createResult = await createUser(connection, createUserDetails)
    expect(isError(createResult)).toBe(true)
    expect((createResult as Error).message).toBe("This group does not exist")
  })
})
