/* eslint-disable import/first */
jest.mock("middleware/withAuthentication/getAuthenticationPayloadFromCookie")
jest.mock("useCases/getUserByEmailAddress")

import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { withAuthentication } from "middleware"
import getAuthenticationPayloadFromCookie from "middleware/withAuthentication/getAuthenticationPayloadFromCookie"
import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import User from "types/User"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"

it("should include current user in the context when successfully get the user", async () => {
  const expectedAuthenticationToken = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as AuthenticationTokenPayload
  const expectedUser = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as User
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(expectedAuthenticationToken)
  const mockedGetUserByEmailAddress = getUserByEmailAddress as jest.MockedFunction<typeof getUserByEmailAddress>
  mockedGetUserByEmailAddress.mockResolvedValue(expectedUser)

  const dummyContext = { req: {} } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeDefined()

    const { emailAddress, username } = currentUser as Partial<User>
    expect(emailAddress).toBe(expectedUser.emailAddress)
    expect(username).toBe(expectedUser.username)

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set current user to undefined in the context when there is an error getting the user", async () => {
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(null)
  const dummyContext = { req: {} } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeNull()
    return undefined as never
  })

  await handler(dummyContext)
})
