import { IncomingMessage, ServerResponse } from "http"
import setCookie from "utils/setCookie"

it("should set the cookie when no cookie is in the response", () => {
  const expectedCookie = "Dummy Cookie"
  const response = new ServerResponse({} as IncomingMessage)
  setCookie(response, expectedCookie)

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toBeDefined()
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toBe(expectedCookie)
})

it("should set the cookie when threre is already a cookie in the response", () => {
  const response = new ServerResponse({} as IncomingMessage)
  const expectedCookie1 = "Dummy Cookie"
  setCookie(response, expectedCookie1)

  const cookieValues1 = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues1).toBeDefined()
  expect(cookieValues1).toHaveLength(1)
  expect(cookieValues1[0]).toBe(expectedCookie1)

  const expectedCookie2 = "Dummy Cookie 2"
  setCookie(response, expectedCookie2)

  const cookieValues2 = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues2).toBeDefined()
  expect(cookieValues2).toHaveLength(2)
  expect(cookieValues2[0]).toBe(expectedCookie1)
  expect(cookieValues2[1]).toBe(expectedCookie2)
})

it("should add the same cookie multiple times", () => {
  const response = new ServerResponse({} as IncomingMessage)
  Array.from(Array(5).keys()).forEach((value) => setCookie(response, `Cookie${value}=Value${value}`))

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toBeDefined()
  cookieValues.forEach((cookieValue, index) => {
    expect(cookieValue).toBe(`Cookie${index}=Value${index}`)
  })
})
