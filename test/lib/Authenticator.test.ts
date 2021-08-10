import { User, UserCredentials } from "lib/User"
import db from "lib/db"
import { storeVerificationCode } from "lib/sendVerificationEmail"
import Authenticator from "lib/Authenticator"

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

const correctPassword = "correctPassword"
const invalidPassword = "invalidPassword"

describe("Authenticator", () => {
  beforeAll(async () => {
    const deleteQuery = `DELETE FROM br7own.users WHERE username = $1`
    await db.none(deleteQuery, [expectedUser.username])

    const insertQuery = `
        INSERT INTO br7own.users(
          username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number, password)
          VALUES ($1, $2, true, $3, $4, '-', NOW(), $5, $6, $7, $8, $9, $10, $11, $12);
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
      expectedUser.phoneNumber,
      correctPassword
    ])
  })

  afterAll(() => {
    db.$pool.end()
  })

  it("should allow the user to authenticate with correct code and password", async () => {
    const verificationCode = "CoDe"
    storeVerificationCode(expectedUser.emailAddress, verificationCode)
    const userCredentials: UserCredentials = {
      emailAddress: expectedUser.emailAddress,
      password: correctPassword,
      verificationCode
    }

    const result = await Authenticator.authenticate(userCredentials)
  })

  it("should not allow the user to authenticate with correct code and incorrect password", async () => {
    const verificationCode = "CoDe"
    storeVerificationCode(expectedUser.emailAddress, verificationCode)
    const userCredentials: UserCredentials = {
      emailAddress: expectedUser.emailAddress,
      password: invalidPassword,
      verificationCode
    }

    const result = await Authenticator.authenticate(userCredentials)
  })

  it("should not allow the user to authenticate with incorrect code and correct password", async () => {
    const verificationCode = "CoDe"
    storeVerificationCode(expectedUser.emailAddress, verificationCode)
    const userCredentials: UserCredentials = {
      emailAddress: expectedUser.emailAddress,
      password: correctPassword,
      verificationCode: "SomethingElse"
    }

    const result = await Authenticator.authenticate(userCredentials)
  })

  it("should allow the user to authenticate with correct code and password only once", async () => {
    const verificationCode = "CoDe"
    storeVerificationCode(expectedUser.emailAddress, verificationCode)
    const userCredentials: UserCredentials = {
      emailAddress: expectedUser.emailAddress,
      password: correctPassword,
      verificationCode
    }

    const result = await Authenticator.authenticate(userCredentials)
  })
})
