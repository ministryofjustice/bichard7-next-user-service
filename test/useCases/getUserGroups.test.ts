import Database from "types/Database"
import { isError } from "types/Result"
import { getUserGroups } from "useCases"

const database = <Database>(<unknown>{ any: () => {} })

it("should return error when database returns error", async () => {
  jest.spyOn(database, "any").mockImplementation(() => {
    throw new Error()
  })

  const result = await getUserGroups(database)
  expect(isError(result)).toBe(true)
})
