import { UserCreateDetails } from "lib/UserCreateDetails"
import Database from "types/Database"
import { isError } from "types/Result"
import createUser from "useCases/createUser"

const database = <Database>(<unknown>{ oneOrNone: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "oneOrNone").mockResolvedValue(expectedError)
  const createUserDetails: UserCreateDetails = {
    username: "",
    forenames: "",
    emailAddress: "",
    endorsedBy: "",
    surname: "",
    organisation: "",
    postCode: "",
    phoneNumber: "",
    postalAddress: ""
  }
  const result = await createUser(database, createUserDetails)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
