import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"

describe("Local development authenticator", () => {
  const authenticator = new LocalAuthenticator()

  test.each`
    emailAddress               | password
    ${"foobar@example.com"}    | ${"foobarbaz"}
    ${"foobar@example.com"}    | ${"password"}
    ${"bichard01@example.com"} | ${"foobarbaz"}
  `("shouldn't authenticate $emailAddress:$password", ({ emailAddress, password }) => {
    const authed = authenticator.authenticate({ emailAddress, password })
    expect(authed).toBe(false)
  })

  test.each`
    emailAddress               | password
    ${"bichard01@example.com"} | ${"password"}
  `("should authenticate $emailAddress:$password", ({ emailAddress, password }) => {
    const authed = authenticator.authenticate({ emailAddress, password })
    expect(authed).toBe(true)
  })
})
