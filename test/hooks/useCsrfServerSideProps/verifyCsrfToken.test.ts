/* eslint-disable import/first */
jest.mock("lib/parseFormData")

import verifyCsrfToken from "hooks/useCsrfServerSideProps/verifyCsrfToken"
import { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import QueryString from "qs"

const expectFormDataToBeValid = (formData: QueryString.ParsedQs, formToken: string) => {
  expect(formData).toHaveProperty("XSRF-TOKEN")
  expect(formData["XSRF-TOKEN"]).toBe(formToken)
  expect(formData).toHaveProperty("Dummy-Form-Field")
  expect(formData["Dummy-Form-Field"]).toBe("DummyValue")
}

it("should be valid when request method is GET", async () => {
  const formToken =
    "XSRF-TOKEN%2Flogin=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.BTiziIFDSI1QVRr5aDJaeNARk9D4824mHOgnj7ybeHU"
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({
    "XSRF-TOKEN": formToken,
    "Dummy-Form-Field": "DummyValue"
  })
  const request = <IncomingMessage>{ method: "GET" }

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(true)
  expectFormDataToBeValid(formData, formToken)
})

it("should be valid when form token and cookie token are equal", async () => {
  const formToken =
    "XSRF-TOKEN%2Flogin=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.BTiziIFDSI1QVRr5aDJaeNARk9D4824mHOgnj7ybeHU"
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({
    "XSRF-TOKEN": formToken,
    "Dummy-Form-Field": "DummyValue"
  })
  const request = <IncomingMessage>{
    method: "POST",
    headers: {
      cookie:
        "XSRF-TOKEN%2Flogin=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.M8YyQuvpv66ecZXEQUrL%2BLF%2BsR3g%2Fw0ysplz47bdeVE"
    }
  }

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(true)
  expectFormDataToBeValid(formData, formToken)
})

it("should be invalid when form token and cookie token are not equal", async () => {
  const formToken =
    "XSRF-TOKEN%2Flogin=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.BTiziIFDSI1QVRr5aDJaeNARk9D4824mHOgnj7ybeHU"
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({
    "XSRF-TOKEN": formToken,
    "Dummy-Form-Field": "DummyValue"
  })
  const request = <IncomingMessage>{
    method: "POST",
    headers: {
      cookie: "XSRF-TOKEN%2Flogin=lvjAfaAq-ki2oJx2BUrlf5TE8-PmK8eZFmPA.VSn3xZ7%2FsbAJ1du6WpHdXLTn9dXspnxF8FJgHOkR4JQ"
    }
  }

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, formToken)
})

it("should be invalid when form token returns error", async () => {
  const formToken = "Invalid Format"
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({
    "XSRF-TOKEN": formToken,
    "Dummy-Form-Field": "DummyValue"
  })
  const request = <IncomingMessage>{
    method: "POST",
    headers: {
      cookie: "XSRF-TOKEN%2Flogin=lvjAfaAq-ki2oJx2BUrlf5TE8-PmK8eZFmPA.VSn3xZ7%2FsbAJ1du6WpHdXLTn9dXspnxF8FJgHOkR4JQ"
    }
  }

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, formToken)
})

it("should be invalid when cookie token returns error", async () => {
  const formToken = "Invalid Format"
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({
    "XSRF-TOKEN": formToken,
    "Dummy-Form-Field": "DummyValue"
  })
  const request = <IncomingMessage>{
    method: "POST",
    headers: {
      cookie: "XSRF-TOKEN%2Flogin=lvjAfaAq-ki2oJx2BUrlf5TE8-PmK8eZFmPA.VSn3xZ7%2FsbAJ1du6WpHdXLTn9dXspnxF8FJgHOkR4JQ"
    }
  }

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, formToken)
})
