import { User } from "lib/User"
import Database from "types/Database"
import { isError } from "types/Result"
import FetchUserUseCase from "use-cases/FetchUserUseCase"

const database = <Database>(<unknown>{ oneOrNone: () => {} })
const useCase = new FetchUserUseCase(database)

it("should return user when database returns the user", async () => {
  const expectedUser = <User>{
    username: "DummyUsername",
    emailAddress: "DummyEmailAddress"
  }

  jest.spyOn(database, "oneOrNone").mockResolvedValue(expectedUser)

  const result = await useCase.fetch("DummyUsername")

  expect(isError(result)).toBe(false)

  const actualUser = <User>result
  expect(actualUser.emailAddress).toBe(expectedUser.emailAddress)
  expect(actualUser.username).toBe(expectedUser.username)
})

it("should return user null when database returns null", async () => {
  jest.spyOn(database, "oneOrNone").mockResolvedValue(null)

  const result = await useCase.fetch("DummyUsername")

  expect(result).toBeNull()
})

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "oneOrNone").mockResolvedValue(expectedError)

  const result = await useCase.fetch("DummyUsername")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
