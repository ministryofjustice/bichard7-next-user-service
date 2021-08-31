import { IncomingMessage, ServerResponse } from "http"
import { signOutUser } from "useCases"

it("should expire the authentication cookie", () => {
  const response = new ServerResponse({} as IncomingMessage)
  signOutUser(response)

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toBeDefined()
  expect(cookieValues[0]).toBe(".AUTH=; Max-Age=0; Path=/; HttpOnly")
})
