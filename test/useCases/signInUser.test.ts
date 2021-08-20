import { ServerResponse } from "http"
import User from "types/User"
import signInUser from "useCases/signInUser"

it("should store authentication token in cookies", () => {
  const user = {
    emailAddress: "dummy@dummy.com",
    username: "dummy_username"
  } as User

  let actualAction: string | undefined
  let actualCookie: string | undefined
  const response = {
    setHeader: (action: string, value: string) => {
      actualAction = action
      actualCookie = value
    }
  } as ServerResponse

  const authenticationToken = signInUser(response, user)

  expect(authenticationToken).toMatch(/.+\..+\..+/)
  expect(actualAction).toBe("Set-Cookie")
  expect(actualCookie).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)
})
