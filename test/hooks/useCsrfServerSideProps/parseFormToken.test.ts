import parseFormToken, { ParseFormTokenResult } from "hooks/useCsrfServerSideProps/parseFormToken"
import QueryString from "qs"
import { isError } from "types/Result"

it("should return form token and cookie name when token exists in the form data", () => {
  const formData = <QueryString.ParsedQs>{
    "XSRF-TOKEN": "XSRF-TOKEN%2Flogin=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.BTiziIFDSI1QVRr5aDJaeNARk9D4824mHOgnj7ybeHU"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(false)

  const { formToken, cookieName } = result as ParseFormTokenResult
  expect(formToken).toBe("VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA")
  expect(cookieName).toBe("XSRF-TOKEN%2Flogin")
})

it("should return error when token does not exist in form data", () => {
  const formData = <QueryString.ParsedQs>{}

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Token not found in the form data.")
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
    "XSRF-TOKEN": "XSRF-TOKEN%2Flogin=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.INVALID_SIGNATURE"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid form token format.")
})
