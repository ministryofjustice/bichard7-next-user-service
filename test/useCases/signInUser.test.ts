import { IncomingMessage, ServerResponse } from "http"
import User from "types/User"
import signInUser from "useCases/signInUser"
import Database from "types/Database"

/* eslint-disable require-await */
it("should store authentication token in cookies", async () => {
  const user = {
    emailAddress: "dummy@dummy.com",
    username: "dummy_username"
  } as User

  const connection = { none: async () => Promise.resolve() } as any as Database

  const response = new ServerResponse({} as IncomingMessage)
  const authenticationToken = await signInUser(connection, response, user)

  expect(authenticationToken).toMatch(/.+\..+\..+/)
  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)
})
/* eslint-disable require-await */
