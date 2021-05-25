import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import Authenticator from "lib/Authenticator"

jest.mock("lib/AuthenticationProvider/LocalAuthenticator")
const LocalAuthenticatorMock = LocalAuthenticator as jest.MockedClass<typeof LocalAuthenticator>

describe("Authenticator class", () => {
  describe("get provider function", () => {
    it("should always return a singleton instance of the authentication provider", () => {
      const firstInstance = Authenticator.getProvider()
      const secondInstance = Authenticator.getProvider()
      expect(firstInstance).toBe(secondInstance)
    })

    it("should return an instance of the local authentication provider", () => {
      const provider = Authenticator.getProvider()
      expect(provider).toBeInstanceOf(LocalAuthenticator)
    })
  })

  describe("authenticate function", () => {
    const emailAddress = "foobar@example.com"
    const password = "foobarbaz"
    const token = Buffer.from("testtoken").toString("base64")

    beforeEach(() => {
      LocalAuthenticatorMock.mockClear()
    })

    it("should return a Token when authentication is successful", () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(token)
      const result = Authenticator.authenticate({ emailAddress, password })
      expect(result).not.toBeInstanceOf(Error)
      expect(result).toEqual(token)
    })

    it("should return an Error when authentication is not successful", () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(new Error("Test error"))
      const result = Authenticator.authenticate({ emailAddress, password })
      expect(result).toBeInstanceOf(Error)
      expect(result).not.toEqual(token)
    })
  })
})
