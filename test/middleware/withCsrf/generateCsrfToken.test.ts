/* eslint-disable @typescript-eslint/no-non-null-assertion */
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import { IncomingMessage, ServerResponse } from "http"

const request = <IncomingMessage>{ url: "/login" }

// let cookieName: string | undefined
// let cookieValue: string | undefined
// const response = <ServerResponse>{
//   setHeader: (name: string, value: string) => {
//     if (name === "Set-Cookie") {
//       const cookieParts = value?.split("=")
//       cookieName = cookieParts?.[0]
//       cookieValue = cookieParts?.splice(1).join("=")
//     }
//   }
// }

it("should generate both form and cookie tokens", () => {
  const { formToken, cookieToken, cookieName } = generateCsrfToken(request)

  const formTokenParts = formToken.split("=")
  expect(formTokenParts).toHaveLength(2)

  const formTokenCookieName = formTokenParts[0]
  const actualFormToken = formTokenParts[1]
  expect(cookieName).toBe("XSRF-TOKEN%2Flogin")
  expect(cookieName).toBe(formTokenCookieName)
  expect(cookieToken).toBeDefined()

  const cookieTokenParts = cookieToken.split(".")
  expect(cookieTokenParts).toHaveLength(2)

  expect(formToken).toBeDefined()

  const actualFormTokenParts = actualFormToken.split(".")
  expect(Number(actualFormTokenParts[0])).not.toBeNaN()
  expect(actualFormTokenParts[1]).toBe(cookieTokenParts[0])
  expect(actualFormTokenParts[2]).not.toBe(cookieTokenParts[1])
})
