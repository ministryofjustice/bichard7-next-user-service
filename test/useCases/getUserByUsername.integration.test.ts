import getConnection from "lib/getConnection"
import User from "types/User"
import { isError } from "types/Result"
import getUserByUsername from "useCases/getUserByUsername"
import exp from "constants"
import deleteUser from "./deleteUser"
import insertUser from "./insertUser"

const connection = getConnection()

const expectedUser = {
  username: "DummyUsername",
  emailAddress: "DummyEmailAddress",
  exclusionList: "DummyExclusionList",
  inclusionList: "DummyInclusionList",
  endorsedBy: "DummyEndorsedBy",
  orgServes: "DummyOrgServes",
  forenames: "DummyForenames",
  postalAddress: "DummyPostalAddress",
  postCode: "AB1 1BA",
  phoneNumber: "DummyPhoneNumber"
} as unknown as User

const createUser = async (isDeleted: boolean) => {
  const deletedAt = isDeleted ? new Date() : null
  const insertQuery = `
  INSERT INTO br7own.users(
    username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number, deleted_at)
    VALUES ($1, $2, true, $3, $4, '-', NOW(), $5, $6, $7, $8, $9, $10, $11, $12);
  `

  await connection.none(insertQuery, [
    expectedUser.username,
    expectedUser.emailAddress,
    expectedUser.exclusionList,
    expectedUser.inclusionList,
    expectedUser.endorsedBy,
    expectedUser.orgServes,
    expectedUser.forenames,
    expectedUser.surname,
    expectedUser.postalAddress,
    expectedUser.postCode,
    expectedUser.phoneNumber,
    deletedAt
  ])
}

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    await deleteUser(connection, expectedUser)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertUser(connection, expectedUser, false)

    const result = await getUserByUsername(connection, expectedUser.username)

    expect(isError(result)).toBe(false)

    const actualUser = <User>result
    expect(actualUser.emailAddress).toBe(expectedUser.emailAddress)
    expect(actualUser.username).toBe(expectedUser.username)
    expect(actualUser.exclusionList).toBe(expectedUser.exclusionList)
    expect(actualUser.inclusionList).toBe(expectedUser.inclusionList)
    expect(actualUser.endorsedBy).toBe(expectedUser.endorsedBy)
    expect(actualUser.orgServes).toBe(expectedUser.orgServes)
    expect(actualUser.forenames).toBe(expectedUser.forenames)
    expect(actualUser.postalAddress).toBe(expectedUser.postalAddress)
    expect(actualUser.postCode).toBe(expectedUser.postCode)
    expect(actualUser.phoneNumber).toBe(expectedUser.phoneNumber)
  })

  it("should return null when user does not exist in the database", async () => {
    const result = await getUserByUsername(connection, "InvalidUsername")

    expect(result).toBeNull()
  })

  it("should return null when user is deleted", async () => {
    await createUser(true)

    const result = await getUserByUsername(connection, expectedUser.username)

    expect(result).toBeNull()
  })
})
