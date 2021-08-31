import { IncomingMessage, ServerResponse } from "http"
import User from "types/User"
import signInUser from "useCases/signInUser"

it("should store authentication token in cookies", () => {
  const user = {
    emailAddress: "dummy@dummy.com",
    username: "dummy_username"
  } as User

  const response = new ServerResponse({} as IncomingMessage)
  const authenticationToken = signInUser(response, user)

  expect(authenticationToken).toMatch(/.+\..+\..+/)
  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)
})
