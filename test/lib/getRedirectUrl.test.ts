import { UserServiceConfig } from "lib/config"
import getValidRedirectUrl from "lib/getRedirectUrl"

describe("getValidRedirectUrl()", () => {
  it("should return 'false' when query object does not have the 'redirect' parameter", () => {
    const query = {}
    const config = {} as UserServiceConfig
    const result = getValidRedirectUrl(query, config)
    expect(result).toBe(false)
  })

  it("should return 'false' when 'redirect' parameter does not contain a valid domain", () => {
    const query = {
      redirect: "http://notthisdomain"
    }
    const config = {
      redirectAccessList: "thisdomain,thatdomain"
    } as UserServiceConfig
    const result = getValidRedirectUrl(query, config)
    expect(result).toBe(false)
  })

  it("should return the redirect url when the domain is valid", () => {
    const query = {
      redirect: "https://correctdomain/somepath/anotherpath?somekey=somevalue"
    }
    const config = {
      redirectAccessList: "thisdomain,thatdomain,correctdomain"
    } as UserServiceConfig
    const result = getValidRedirectUrl(query, config)
    expect(result).toBe(query.redirect)
  })
})
