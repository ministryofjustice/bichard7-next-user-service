import { ServerResponse } from "http"
import { signOutUser } from "useCases"

it("should expire the authentication cookie", () => {
  let actualAction: string | undefined
  let actualCookie: string | undefined
  const response = {
    setHeader: (action: string, value: string) => {
      actualAction = action
      actualCookie = value
    }
  } as ServerResponse

  signOutUser(response)

  expect(actualAction).toBe("Set-Cookie")
  expect(actualCookie).toBe(".AUTH=; Max-Age=0; Path=/; HttpOnly")
})
