/* eslint-disable import/first */
jest.mock("lib/parseFormData")

import { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import { User } from "types/User"
import validateDeleteUserRequest from "useCases/validateDeleteUserRequest"

const user = <User>{
  username: "TestUser"
}

const request = <IncomingMessage>{}

it("should return true when provided email address matches", async () => {
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: user.username })

  const result = await validateDeleteUserRequest(user, request)

  expect(result).toBe(true)
})

it("should return false when provided email address does not match", async () => {
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({ deleteAccountConfirmation: "InvalidUsername" })

  const result = await validateDeleteUserRequest(user, request)

  expect(result).toBe(false)
})
