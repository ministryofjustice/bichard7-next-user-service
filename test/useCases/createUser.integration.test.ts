import createUser from "useCases/createUser"
import User from "types/User"
import getUserByUsername from "useCases/getUserByUsername"
import { isError } from "types/Result"
import Database from "types/Database"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"

describe("DeleteUserUseCase", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return error when adding a user with the same username as one from the database", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]
    const user = users[0]

    const expectedError = new Error(`Username Bichard01 already exists.`)

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroup.group_id,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,"
    }

    const result = await createUser(connection, currentUserId, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when adding a user with the same email as one from the database", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]
    const user = users[0]

    const createUserDetails = {
      username: `${user.username}zyx`,
      forenames: `${user.forenames}xyz`,
      emailAddress: user.email,
      endorsedBy: `${user.endorsed_by}xyz`,
      surname: `${user.surname}xyz`,
      orgServes: `${user.org_serves}xyz`,
      groupId: selectedGroup.group_id,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,"
    }

    const expectedError = new Error(`Email address bichard01@example.com already exists.`)
    const result = await createUser(connection, currentUserId, createUserDetails)
    expect(isError(result)).toBe(true)
    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should be possible to add a user to my force", async () => {
    const username = "Bichard02"
    await insertIntoUsersTable(users.filter((u) => u.username !== username))
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id

    const user = users.filter((u) => u.username === "Bichard02")[0]
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroup.id,
      visibleForces: user.visible_forces,
      visibleCourts: user.visible_courts,
      excludedTriggers: user.excluded_triggers
    }

    const createResult = await createUser(connection, currentUserId, createUserDetails)
    expect(isError(createResult)).toBe(false)

    const getResult = await getUserByUsername(connection, user.username)
    expect(isError(getResult)).toBe(false)

    const actualUser = <User>getResult
    expect(actualUser.emailAddress).toBe(user.email)
    expect(actualUser.username).toBe(user.username)
    expect(actualUser.endorsedBy).toBe(user.endorsed_by)
    expect(actualUser.orgServes).toBe(user.org_serves)
    expect(actualUser.forenames).toBe(user.forenames)
    expect(actualUser.visibleForces).toBe(user.visible_forces)
    expect(actualUser.visibleCourts).toBe(user.visible_courts)
    expect(actualUser.excludedTriggers).toBe(user.excluded_triggers)
  })

  it("should add the user to the correct group that exists in the user table", async () => {
    const username = "Bichard02"
    await insertIntoUsersTable(users.filter((u) => u.username !== username))
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]
    const user = users.filter((u) => u.username === "Bichard02")[0]

    const selectedGroups = await selectFromTable("groups", "name", "B7Supervisor_grp")
    const selectedGroup = selectedGroups[0]

    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,",
      groups: [selectedGroup]
    }
    const createResult = await createUser(connection, currentUser, createUserDetails)
    expect(isError(createResult)).toBe(false)

    const expectedUsers = await selectFromTable("users", "email", user.email)
    const expectedUser = expectedUsers[0]
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", expectedUser.id)
    const expectedUserGroup = expectedUsersGroups[0]
    expect(expectedUser.id).toBe(expectedUserGroup.user_id)
    expect(selectedGroup.id).toBe(expectedUserGroup.group_id)
  })

  it("should not add a group that doesn't exist", async () => {
    const username = "Bichard02"
    await insertIntoUsersTable(users.filter((u) => u.username !== username))
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id

    const user = users.filter((u) => u.username === username)[0]
    const selectedGroups = await selectFromTable("groups")

    const greatestPossibleIdPlusOne =
      selectedGroups.reduce((a: any, c: any) => {
        return a + c.id
      }, 0) + 1

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: greatestPossibleIdPlusOne,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,"
    }

    const createResult = await createUser(connection, currentUserId, createUserDetails)
    expect(isError(createResult)).toBe(false)

    const userId = (await selectFromTable("users", "username", user.username))[0].id
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", userId)
    expect(expectedUsersGroups).toHaveLength(0)
  })

  it("should not add the user to the group if current user does not have that group", async () => {
    await insertIntoUsersTable(users.filter((u) => u.username === "Bichard01"))
    await insertIntoGroupsTable(groups)
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id

    const user = users.filter((u) => u.username === "Bichard02")[0]
    const selectedGroups = await selectFromTable("groups")

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroups[0].id,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,"
    }

    const createResult = await createUser(connection, currentUserId, createUserDetails)
    expect(isError(createResult)).toBe(false)

    const userId = (await selectFromTable("users", "username", user.username))[0].id
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", userId)
    expect(expectedUsersGroups).toHaveLength(0)
  })
})
