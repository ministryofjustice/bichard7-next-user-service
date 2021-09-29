import { AuthenticationTokenPayload, decodeAuthenticationToken } from "lib/token/authenticationToken"
import getAuthenticationPayloadFromCookie from "middleware/withAuthentication/getAuthenticationPayloadFromCookie"
import { isError } from "types/Result"

jest.mock("lib/token/authenticationToken")

const request = {
  cookies: {
    ".AUTH": "DummyToken"
  }
}

const authenticationTokenPayload = {
  username: "dummy",
  emailAddress: "dummy@dummy.com"
} as AuthenticationTokenPayload

it("should return authentication payload when there is avalid authentication cookie", () => {
  const mockedDecodeAuthenticationToken = decodeAuthenticationToken as jest.MockedFunction<
    typeof decodeAuthenticationToken
  >
  mockedDecodeAuthenticationToken.mockReturnValue(authenticationTokenPayload)

  const result = getAuthenticationPayloadFromCookie(request)

  expect(isError(result)).toBe(false)
  expect(result).toBeDefined()

  const { username, emailAddress } = <AuthenticationTokenPayload>result
  expect(username).toBe(authenticationTokenPayload.username)
  expect(emailAddress).toBe(authenticationTokenPayload.emailAddress)
})

it("should return error when authentication cookie does not exist", () => {
  const result = getAuthenticationPayloadFromCookie({ cookies: {} })

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Authentication token not found.")
})

it("should return error when authentication cookie is invalid", () => {
  const expectedError = new Error("Dummy Error")
  const mockedDecodeAuthenticationToken = decodeAuthenticationToken as jest.MockedFunction<
    typeof decodeAuthenticationToken
  >
  mockedDecodeAuthenticationToken.mockReturnValue(expectedError)

  const result = getAuthenticationPayloadFromCookie(request)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
