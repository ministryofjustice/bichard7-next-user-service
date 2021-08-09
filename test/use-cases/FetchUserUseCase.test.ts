import Database from "types/Database"
import { isError } from "types/Result"
import FetchUserUseCase from "use-cases/FetchUserUseCase"

const database = <Database>(<unknown>{ oneOrNone: () => {} })
const useCase = new FetchUserUseCase(database)

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "oneOrNone").mockResolvedValue(expectedError)

  const result = await useCase.fetch("DummyUsername")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
