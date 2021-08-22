import User from "types/User"
import { isError } from "types/Result"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import { Tables } from '../../testFixtures/database/types'
import getTestConnection from '../../testFixtures/getTestConnection'
import { users } from '../../testFixtures/database/data/users'
import insertIntoTable from "../../testFixtures/database/insertIntoTable"

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    await deleteFromTable(Tables.Users)
  })

  afterAll(() => {
    getTestConnection().$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertIntoTable(Tables.Users, users)
    const connection = getTestConnection()

    const user = await getUserByEmailAddress(connection, 'bichard01@example.com') as User

    expect(isError(user)).toBe(false)

    expect(user.emailAddress).toBe('bichard01@example.com')
    expect(user.username).toBe('Bichard01')
    expect(user.exclusionList).toBe("1, 2, 3, 4",)
    expect(user.inclusionList).toBe("5, 6, 7, 8",)
    expect(user.endorsedBy).toBe("endorsed_by 01")
    expect(user.orgServes).toBe("org_severs 01")
    expect(user.forenames).toBe("Bichard User 01",)
    expect(user.postalAddress).toBe("address 01")
    expect(user.postCode).toBe("SE1 0EF")
    expect(user.phoneNumber).toBe("0800 111 222")
  })

  it("should return null when user does not exist in the database", async () => {
    const connection = getTestConnection()
    const user = await getUserByEmailAddress(connection, "InvalidUsername")

    expect(user).toBeNull()
  })

  it("should return null when user is deleted", async () => {
    await insertIntoTable(Tables.Users, users)
    const connection = getTestConnection()
    const user = await getUserByEmailAddress(connection, 'wrongemail@emailaddres.com')

    expect(user).toBeNull()
  })
})
