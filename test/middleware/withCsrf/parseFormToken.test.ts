import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import parseFormToken, { ParseFormTokenResult } from "middleware/withCsrf/parseFormToken"
import { IncomingMessage } from "http"
import QueryString from "qs"
import { isError } from "types/Result"

const request = <IncomingMessage>{ url: "/login" }

it("should return form token and cookie name when token exists in the form data", () => {
  const { formToken, cookieName: expectedCookieName } = generateCsrfToken(request)
  const formData = <QueryString.ParsedQs>{
    "XSRF-TOKEN": formToken
  }
  const expectedFormToken = formToken.split("=")[1].split(".")[1]

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(false)

  const { formToken: actualFormToken, cookieName: actualCookieName } = result as ParseFormTokenResult
  expect(actualFormToken).toBe(expectedFormToken)
  expect(actualCookieName).toBe(expectedCookieName)
})

it("should return error when token does not exist in form data", () => {
  const formData = <QueryString.ParsedQs>{}

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Token not found in the form data.")
})

it("should return error when token is empty in form data", () => {
  const formData = <QueryString.ParsedQs>{ "XSRF-TOKEN": "" }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Token is empty in the form data.")
})

it("should return error when token format is invalid", () => {
  const formData = <QueryString.ParsedQs>{
    "XSRF-TOKEN": "Invalid format"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid form token format.")
})

it("should return error when token signature is invalid", () => {
  const formData = <QueryString.ParsedQs>{
    "XSRF-TOKEN": "XSRF-TOKEN%2Flogin=1629370536933.QO60fsUX-KKkGnqboM90s8VS9C5zSdrysjrg.INVALID_SIGNATURE"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid form token format.")
})

it("should return error when token is expired", () => {
  const formData = <QueryString.ParsedQs>{
    "XSRF-TOKEN":
      "XSRF-TOKEN%2Flogin=1629370536933.QO60fsUX-KKkGnqboM90s8VS9C5zSdrysjrg.31NFF0UFt3Pa7IAeRDiagzG8BPM45cIH8EMynKUlpzY"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Expired form token.")
})
