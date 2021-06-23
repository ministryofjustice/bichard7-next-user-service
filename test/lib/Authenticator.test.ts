import Authenticator from "lib/Authenticator"
import DatabaseAuthenticator from "lib/AuthenticationProvider/DatabaseAuthenticator"
import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import { AuthenticationResult } from "lib/AuthenticationResult"
import config from "lib/config"

jest.mock("pg")

jest.mock("lib/AuthenticationProvider/LocalAuthenticator")
const LocalAuthenticatorMock = LocalAuthenticator as jest.MockedClass<typeof LocalAuthenticator>

describe("Authenticator class", () => {
  beforeEach(() => {
    config.authenticator = "LOCAL"
    LocalAuthenticatorMock.mockClear()
    Authenticator.clearProvider()
  })

  describe("get provider function", () => {
    it("should always return a singleton instance of the authentication provider", () => {
      const firstInstance = Authenticator.getProvider()
      const secondInstance = Authenticator.getProvider()
      expect(firstInstance).toBe(secondInstance)
    })

    it("should return a local authentication provider when local auth is specified", () => {
      const provider = Authenticator.getProvider()
      expect(provider).toBeInstanceOf(LocalAuthenticator)
    })

    it("should return a database autentication provider when DB auth is specified", () => {
      config.authenticator = "DB"
      const provider = Authenticator.getProvider()
      expect(provider).toBeInstanceOf(DatabaseAuthenticator)
    })
  })

  describe("authenticate function", () => {
    const emailAddress = "foobar@example.com"
    const password = "foobarbaz"
    const token = Buffer.from("testtoken").toString("base64")

    it("should return a Token when authentication is successful", async () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(
        new Promise<AuthenticationResult>((resolve) => resolve(token))
      )
      const result = await Authenticator.authenticate({ emailAddress, password })
      expect(result).not.toBeInstanceOf(Error)
      expect(result).toEqual(token)
    })

    it("should return an Error when authentication is not successful", async () => {
      LocalAuthenticatorMock.prototype.authenticate.mockReturnValue(
        new Promise<AuthenticationResult>((resolve) => resolve(new Error("Test error")))
      )
      const result = await Authenticator.authenticate({ emailAddress, password })
      expect(result).toBeInstanceOf(Error)
      expect(result).not.toEqual(token)
    })
  })
})
