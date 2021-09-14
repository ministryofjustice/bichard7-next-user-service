import Database from "types/Database"
import { isError } from "types/Result"
import logJwt from "useCases/logJwt"

const database = <Database>(<unknown>{ none: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "none").mockImplementation(() => {
    throw expectedError
  })

  const result = await logJwt(database, "test-value-01", "test-value-02")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
