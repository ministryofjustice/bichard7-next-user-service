import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import UserGroup from "types/UserGroup"
import hasUserAccessToUrl from "useCases/hasUserAccessToUrl"

interface TestData {
  group: UserGroup | null
  url: string
  expectedResult: boolean
}

const testData: TestData[] = [
  {
    group: "B7UserManager",
    url: "/users/users",
    expectedResult: true
  },
  {
    group: "B7Allocator",
    url: "/users/users",
    expectedResult: false
  },
  {
    group: "B7GeneralHandler",
    url: "/bichard-ui",
    expectedResult: true
  },
  {
    group: "B7UserManager",
    url: "/bichard-ui",
    expectedResult: false
  },
  {
    group: null,
    url: "/users/",
    expectedResult: true
  },
  {
    group: null,
    url: "/users",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/account/change-password",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/logout",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/logout",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/assets",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/_next/static",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/access-denied",
    expectedResult: true
  }
]

test.each(testData)("should return the correct result for %s", ({ group, url, expectedResult }) => {
  const token = { groups: group ? [group] : [] } as unknown as AuthenticationTokenPayload
  const result = hasUserAccessToUrl(token, url)

  expect(result).toBe(expectedResult)
})
