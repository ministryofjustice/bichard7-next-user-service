import Database from "types/Database"
import { isError } from "types/Result"
import createUser from "useCases/createUser"
import storeVerificationCode from "useCases/storeVerificationCode"
import users from "../../testFixtures/database/data/users"
import getTestConnection from "../../testFixtures/getTestConnection"

const database = <Database>(<unknown>{ result: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "result").mockResolvedValue(expectedError)

  const result = await storeVerificationCode(database, "DummyEmailAddress", "DummyVerificationCode")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})

it("should return error when user does not exist", async () => {
  const connection = getTestConnection()

  const result = await storeVerificationCode(connection, "DummyEmailAddress", "DummyVerificationCode")

  expect(isError(result)).toBe(true)
})

it("should update all values", async () => {
  const connection = getTestConnection()

  const user = users
    .filter((u) => u.username === "Bichard02")
    .map((u) => ({
      username: u.username,
      forenames: u.forenames,
      emailAddress: u.email,
      endorsedBy: u.endorsed_by,
      surname: u.surname,
      orgServes: u.org_serves,
      groupId: 1
    }))[0]

  const creationResult = await createUser(connection, 1, user)
  expect(isError(creationResult)).toBe(false)

  const storeResult = await storeVerificationCode(connection, user.emailAddress, "DummyVerificationCode")
  expect(isError(storeResult)).toBe(true)
})
