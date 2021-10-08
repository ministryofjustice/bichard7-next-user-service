import Database from "types/Database"
import { isError } from "types/Result"
import { getUserGroups } from "useCases"

const database = <Database>(<unknown>{ any: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Dummy error message")
  jest.spyOn(database, "any").mockRejectedValue(expectedError)

  const result = await getUserGroups(database, ["dummyUsername"])

  expect(isError(result)).toBe(true)

  const actualError = result as Error
  expect(actualError.message).toBe(expectedError.message)
})
