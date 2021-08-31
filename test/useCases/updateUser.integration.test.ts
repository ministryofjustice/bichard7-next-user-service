import { isError } from "types/Result"
import updateUser from "useCases/updateUser"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"

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

  it("should update user successfully when called", async () => {
    await insertIntoTable(users)
    const initialUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser = initialUserList[0]

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04",
      phoneNumber: "07777 000 777",
      endorsedBy: "endorsed by 04",
      orgServes: "orgServes 04",
      postCode: "XXX 333",
      postalAddress: "postal address 04"
    }

    const result = await updateUser(connection, user)
    expect(result).toBe(true)

    const initialUserList02 = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser02 = initialUserList02[0]

    expect(initialUser02.id).toBe(initialUser.id)
    expect(initialUser02.username).toBe("Bichard04")
    expect(initialUser02.forenames).toBe("forename04")
    expect(initialUser02.surname).toBe("surname04")
    expect(initialUser02.phone_number).toBe("07777 000 777")
    expect(initialUser02.endorsed_by).toBe("endorsed by 04")
    expect(initialUser02.org_serves).toBe("orgServes 04")
    expect(initialUser02.post_code).toBe("XXX 333")
    expect(initialUser02.postal_address).toBe("postal address 04")
  })

  it("should not update emailAddress if provided in user object", async () => {
    const emailAddress = "bichard01@example.com"

    await insertIntoTable(users)
    const initialUserList = await selectFromTable("users", "email", emailAddress)
    const initialUser = initialUserList[0]

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04A",
      phoneNumber: "07777 000 777",
      endorsedBy: "endorsed by 04",
      orgServes: "orgAServes 04",
      emailAddress: "bichard04@example.com",
      postalAddress: "postal address 04",
      postCode: "YYY 777"
    }

    const result = await updateUser(connection, user)
    expect(result).toBe(true)
    const initialUserList02 = await selectFromTable("users", "email", emailAddress)
    const initialUser02 = initialUserList02[0]

    expect(initialUser02.email).toBe(emailAddress)
  })

  it("should throw the correct error if user is not found", async () => {
    await insertIntoTable(users)
    const expectedError = Error("Error updating user")

    const user = {
      id: 0,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04A",
      phoneNumber: "07777 000 777",
      endorsedBy: "endorsed by 04",
      orgServes: "orgAServes 04",
      postalAddress: "postal address 04",
      postCode: "YYY 777"
    }

    const result = await updateUser(connection, user)
    expect(isError(expectedError))
    expect((result as Error).message).toBe(expectedError.message)
  })
})
