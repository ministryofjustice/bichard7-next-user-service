import Database from "types/Database"
import { isError } from "types/Result"
import logJwt from "lib/logJwt"
import { v4 as uuidv4 } from "uuid"

const database = <Database>(<unknown>{ none: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "none").mockImplementation(() => {
    throw expectedError
  })

  const uniqueId = uuidv4()

  const result = await logJwt(database, 3, uniqueId)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
