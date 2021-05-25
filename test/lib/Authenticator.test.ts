import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import { Authenticator } from "lib/Authenticator"
import { User } from "lib/User"

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

    beforeEach(() => {
      LocalAuthenticatorMock.mockClear()
    })

    it("should return a User when authentication is successful", () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue({ emailAddress })
      const result = Authenticator.authenticate({ emailAddress, password })
      expect(result).not.toBeInstanceOf(Error)
      expect(result).toHaveProperty("emailAddress")
      expect((result as User).emailAddress).toEqual(emailAddress)
    })

    it("should return an Error when authentication is not successful", () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(new Error("Test error"))
      const result = Authenticator.authenticate({ emailAddress, password })
      expect(result).toBeInstanceOf(Error)
      expect(result).not.toHaveProperty("emailAddress")
    })
  })
})
