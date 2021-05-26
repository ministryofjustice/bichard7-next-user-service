import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import jwt from "jsonwebtoken"
import config from "lib/config"
import { TokenPayload } from "lib/Token"

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
    const token = authenticator.authenticate({ emailAddress: "bichard01@example.com", password: "password" })
    const data = jwt.verify(token as string, config.localAuthenticator.jwtSecret)

    expect(data).not.toHaveProperty("password")

    const payload = data as TokenPayload
    expect(payload.username).toEqual("Bichard01")
    expect(payload.exclusionList).toEqual(["5", "6", "7", "8"])
    expect(payload.inclusionList).toEqual(["B41ME00"])
    expect(payload.forenames).toEqual("Bichard User")
    expect(payload.surname).toEqual("01")
    expect(payload.emailAddress).toEqual("bichard01@example.com")
    expect(payload.groups).toEqual([
      "B7Allocator",
      "B7Audit",
      "B7ExceptionHandler",
      "B7GeneralHandler",
      "B7Supervisor",
      "B7TriggerHandler"
    ])
  })
})
