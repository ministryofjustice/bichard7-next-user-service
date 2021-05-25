import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import { Authenticator } from "lib/Authenticator"

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

    it("should return an object containing the passed user details", () => {
      const authenticatedUser = Authenticator.authenticate({ emailAddress, password })
      expect(authenticatedUser.emailAddress).toEqual(emailAddress)
      expect(authenticatedUser.password).toEqual(password)
    })

    it("should return a true `authenticated` key when the user is authenticated", () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(true)
      const { authenticated } = Authenticator.authenticate({ emailAddress, password })
      expect(authenticated).toBe(true)
    })

    it("should return a false `authenticated` key when the user is not authenticated", () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(false)
      const { authenticated } = Authenticator.authenticate({ emailAddress, password })
      expect(authenticated).toBe(false)
    })
  })
})
