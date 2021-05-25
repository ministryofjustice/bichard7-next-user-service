import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import { User } from "lib/User"

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
    expect(result).not.toHaveProperty("emailAddress")
  })

  test.each`
    emailAddress               | password
    ${"bichard01@example.com"} | ${"password"}
  `("should authenticate $emailAddress:$password", ({ emailAddress, password }) => {
    const result = authenticator.authenticate({ emailAddress, password })
    expect(result).not.toBeInstanceOf(Error)
    expect(result).toHaveProperty("emailAddress")
    expect((result as User).emailAddress).toEqual(emailAddress)
  })
})
