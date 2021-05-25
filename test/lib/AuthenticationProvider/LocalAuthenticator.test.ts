import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import jwt from "jsonwebtoken"
import config from "lib/config"

describe("Local development authenticator", () => {
  const authenticator = new LocalAuthenticator()

  test.each`
    emailAddress               | password
    ${null}                    | ${null}
    ${""}                      | ${""}
    ${"foobar@example.com"}    | ${"foobarbaz"}
    ${"foobar@example.com"}    | ${"password"}
    ${"bichard01@example.com"} | ${"foobarbaz"}
  `("shouldn't authenticate $emailAddress:$password", ({ emailAddress, password }) => {
    const result = authenticator.authenticate({ emailAddress, password })
    expect(result).toBeInstanceOf(Error)
    expect(typeof result).not.toBe("string")
  })

  test.each`
    emailAddress                        | password
    ${"bichard01@example.com"}          | ${"password"}
    ${"b7exceptionhandler@example.com"} | ${"password"}
  `("should authenticate $emailAddress:$password", ({ emailAddress, password }) => {
    const result = authenticator.authenticate({ emailAddress, password })
    expect(result).not.toBeInstanceOf(Error)
    expect(typeof result).toBe("string")
  })

  it("should generate a valid JWT token for an authenticated user", () => {
    const token = authenticator.authenticate({ emailAddress: "bichard01@example.com", password: "password" })
    const payload = jwt.verify(token as string, config.localAuthenticator.jwtSecret)

    expect(payload).toHaveProperty("emailAddress")
    expect(payload).toHaveProperty("role")
    expect(payload).toHaveProperty("displayName")
    expect(payload).toHaveProperty("exp")
    expect(payload).not.toHaveProperty("password")
  })
})
