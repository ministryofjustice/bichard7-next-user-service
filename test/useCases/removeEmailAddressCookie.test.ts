import { IncomingMessage, ServerResponse } from "http"
import { removeEmailAddressCookie } from "useCases"

it("should expire the email address cookie and empty the value", () => {
  const response = new ServerResponse({} as IncomingMessage)
  removeEmailAddressCookie(response)

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(/LOGIN_EMAIL=; Max-Age=0; Path=\/login; HttpOnly/)
})
