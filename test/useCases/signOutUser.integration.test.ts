import { IncomingMessage, ServerResponse } from "http"
import Database from "types/Database"
import { isError } from "types/Result"
import User from "types/User"
import { signInUser, signOutUser } from "useCases"

/* eslint-disable require-await */
it("should expire the authentication cookie", async () => {
  const user = {
    emailAddress: "dummy@dummy.com",
    username: "dummy_username"
  } as User

  const connection = { none: async () => Promise.resolve() } as any as Database

  const response = new ServerResponse({} as IncomingMessage)
  const authenticationToken = await signInUser(connection, response, user)
  expect(isError(authenticationToken)).toBe(false)

  expect(authenticationToken).toMatch(/.+\..+\..+/)
  let cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)

  const signoutUserResult = await signOutUser(connection, response)
  expect(isError(signoutUserResult)).toBe(false)

  cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(0)
})
/* eslint-disable require-await */
