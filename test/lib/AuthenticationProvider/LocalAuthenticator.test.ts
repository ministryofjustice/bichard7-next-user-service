import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import jwt from "jsonwebtoken"
import config from "lib/config"
import { TokenPayload } from "lib/Token"
import users from "data/users"

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
    emailAddress                       | password
    ${"bichard01@example.com"}         | ${"password"}
    ${"allocator1@example.com"}        | ${"password"}
    ${"audit1@example.com"}            | ${"password"}
    ${"exceptionhandler1@example.com"} | ${"password"}
    ${"generalhandler1@example.com"}   | ${"password"}
    ${"supervisor1@example.com"}       | ${"password"}
    ${"triggerhandler1@example.com"}   | ${"password"}
    ${"allocator2@example.com"}        | ${"password"}
    ${"audit2@example.com"}            | ${"password"}
    ${"exceptionhandler2@example.com"} | ${"password"}
    ${"generalhandler2@example.com"}   | ${"password"}
    ${"supervisor2@example.com"}       | ${"password"}
    ${"triggerhandler2@example.com"}   | ${"password"}
    ${"nogroupsassigned@example.com"}  | ${"password"}
  `("should authenticate $emailAddress:$password", ({ emailAddress, password }) => {
    const result = authenticator.authenticate({ emailAddress, password })
    expect(result).not.toBeInstanceOf(Error)
    expect(typeof result).toBe("string")
  })

  it("should generate a valid JWT token for an authenticated user", () => {
    const emailAddress = "bichard01@example.com"
    const token = authenticator.authenticate({ emailAddress, password: "password" })
    const data = jwt.verify(token as string, config.localAuthenticator.jwtSecret)

    expect(data).not.toBeNull()
    expect(data).not.toHaveProperty("password")

    const payload = data as TokenPayload
    const [user] = users.filter((u) => u.emailAddress === emailAddress)

    expect(payload.username).toEqual(user.username)
    expect(payload.exclusionList).toEqual(user.exclusionList)
    expect(payload.inclusionList).toEqual(user.inclusionList)
    expect(payload.forenames).toEqual(user.forenames)
    expect(payload.surname).toEqual(user.surname)
    expect(payload.emailAddress).toEqual(user.emailAddress)
    expect(payload.groups).toEqual(user.groups)
  })
})
