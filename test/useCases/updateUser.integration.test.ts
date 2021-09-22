import { isError } from "types/Result"
import updateUser from "useCases/updateUser"
import createUser from "useCases/createUser"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import fakeAuditLogger from "../fakeAuditLogger"

describe("updatePassword", () => {
  let connection: Database

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  beforeAll(() => {
    connection = getTestConnection()
  })

  afterAll(() => {
    connection.$pool.end()
  })

  const insertUserWithGroup = async () => {
    await insertIntoGroupsTable(groups)

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id

    const user = users[0]

    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groupId: initialGroupId
    }

    await createUser(connection, createUserDetails)
  }

  it("should update user successfully when called", async () => {
    await insertUserWithGroup()
    const initialUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser = initialUserList[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04",
      endorsedBy: "endorsed by 04",
      orgServes: "orgServes 04",
      groupId: initialGroupId
    }

    const result = await updateUser(connection, fakeAuditLogger, user)
    expect(result).toBeUndefined()

    const initialUserList02 = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser02 = initialUserList02[0]

    expect(initialUser02.id).toBe(initialUser.id)
    expect(initialUser02.username).toBe("Bichard04")
    expect(initialUser02.forenames).toBe("forename04")
    expect(initialUser02.surname).toBe("surname04")
    expect(initialUser02.endorsed_by).toBe("endorsed by 04")
    expect(initialUser02.org_serves).toBe("orgServes 04")
  })

  it("should not update emailAddress if provided in user object", async () => {
    await insertUserWithGroup()
    const emailAddress = "bichard01@example.com"
    const initialUserList = await selectFromTable("users", "email", emailAddress)
    const initialUser = initialUserList[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04A",
      endorsedBy: "endorsed by 04",
      orgServes: "orgAServes 04",
      emailAddress: "bichard04@example.com",
      groupId: initialGroupId
    }

    const result = await updateUser(connection, fakeAuditLogger, user)
    expect(result).toBeUndefined()
    const initialUserList02 = await selectFromTable("users", "email", emailAddress)
    const initialUser02 = initialUserList02[0]

    expect(initialUser02.email).toBe(emailAddress)
  })

  it("should throw the correct error if user is not found", async () => {
    await insertUserWithGroup()
    const expectedError = Error("Error updating user")
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id

    const user = {
      id: 0,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04A",
      endorsedBy: "endorsed by 04",
      orgServes: "orgAServes 04",
      groupId: initialGroupId
    }

    const result = await updateUser(connection, fakeAuditLogger, user)
    expect(isError(expectedError))
    expect((result as Error).message).toBe(expectedError.message)
  })

  it("should update the user with the correct group", async () => {
    await insertIntoGroupsTable(groups)

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id
    const updatedGroupId = selectedGroups[3].id

    const user = users[0]

    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groupId: initialGroupId
    }

    await createUser(connection, createUserDetails)

    const initialUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser = initialUserList[0]

    const updateUserDetails: any = {
      id: initialUser.id,
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endoresed by 01",
      orgServes: "new org serves",
      groupId: updatedGroupId
    }

    const updateResult = await updateUser(connection, fakeAuditLogger, updateUserDetails)
    expect(isError(updateResult)).toBe(false)

    const expectedUsers = await selectFromTable("users", "email", user.email)
    const expectedUser = expectedUsers[0]
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", initialUser.id)
    const expectedUserGroup = expectedUsersGroups[0]

    expect(expectedUser.id).toBe(expectedUserGroup.user_id)
    expect(updatedGroupId).toBe(expectedUserGroup.group_id)
  })

  it("should throw foreign key constraint error when group does not exist", async () => {
    await insertIntoGroupsTable(groups)

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id

    const greatestPossibleGroupIdPlusOne =
      selectedGroups.reduce((a: any, c: any) => {
        return a + c.id
      }, 0) + 1

    const user = users[0]

    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groupId: initialGroupId
    }

    await createUser(connection, createUserDetails)

    const initialUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser = initialUserList[0]

    const updateUserDetails: any = {
      id: initialUser.id,
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endorsed by 01",
      orgServes: "new org serves",
      groupId: greatestPossibleGroupIdPlusOne
    }

    const updateResult = await updateUser(connection, fakeAuditLogger, updateUserDetails)
    expect(isError(updateResult)).toBe(true)
    expect((updateResult as Error).message).toBe("This group does not exist")
  })

  it("should delete all previous records in the users_groups table", async () => {
    await insertIntoGroupsTable(groups)

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroupId = selectedGroups[0].id
    const updatedGroupId = selectedGroups[3].id

    const user = users[0]

    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groupId: initialGroupId
    }

    await createUser(connection, createUserDetails)

    const initialUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser = initialUserList[0]

    const updateUserDetails: any = {
      id: initialUser.id,
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endoresed by 01",
      orgServes: "new org serves",
      groupId: updatedGroupId
    }

    const updateResult = await updateUser(connection, fakeAuditLogger, updateUserDetails)
    expect(isError(updateResult)).toBe(false)

    const expectedUsers = await selectFromTable("users", "email", user.email)
    const expectedUser = expectedUsers[0]
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", initialUser.id)
    const expectedUserGroup = expectedUsersGroups[0]

    expect(expectedUsersGroups.length).toBe(1)
    expect(expectedUser.id).toBe(expectedUserGroup.user_id)
    expect(updatedGroupId).toBe(expectedUserGroup.group_id)
  })
})
