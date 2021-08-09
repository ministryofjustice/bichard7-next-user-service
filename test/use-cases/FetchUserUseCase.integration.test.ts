import db from "lib/db"
import { User } from "lib/User"
import { isError } from "types/Result"
import FetchUserUseCase from "use-cases/FetchUserUseCase"

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

const useCase = new FetchUserUseCase(db)

describe("DeleteUserUseCase", () => {
  beforeEach(async () => {
    const deleteQuery = `
      DELETE FROM br7own.users WHERE username = $1
    `
    await db.none(deleteQuery, [expectedUser.username])

    const insertQuery = `
      INSERT INTO br7own.users(
        username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number)
        VALUES ($1, $2, true, $3, $4, '-', NOW(), $5, $6, $7, $8, $9, $10, $11);
    `
    await db.none(insertQuery, [
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
      expectedUser.phoneNumber
    ])
  })

  afterAll(() => {
    db.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    const result = await useCase.fetch(expectedUser.username)

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
    const result = await useCase.fetch("InvalidUsername")

    expect(result).toBeNull()
  })
})
