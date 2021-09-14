import { IncomingMessage, ServerResponse } from "http"
import User from "types/User"
import signInUser from "useCases/signInUser"
import { decodeAuthenticationToken } from "lib/token/authenticationToken"

it("should store authentication token in cookies", () => {
  const user = {
    emailAddress: "dummy@dummy.com",
    username: "dummy_username"
  } as User

  const response = new ServerResponse({} as IncomingMessage)
  const authenticationToken = signInUser(response, user, "test-value-01")

  expect(authenticationToken).toMatch(/.+\..+\..+/)
  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)
})

it("should include the correct UUID in the authentication token value", () => {
  const user = {
    emailAddress: "dummy@dummy.com",
    username: "dummy_username"
  } as User

  const Uuid = "test-value-01"

  const response = new ServerResponse({} as IncomingMessage)
  const authenticationToken = signInUser(response, user, Uuid)
  const { id } = decodeAuthenticationToken(authenticationToken) as any
  expect(id).toBe(Uuid)
})
