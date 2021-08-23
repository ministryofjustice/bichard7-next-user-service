/* eslint-disable import/first */
jest.mock("middleware/withAuthentication/getUserFromCookie")

import { withAuthentication } from "middleware"
import getUserFromCookie from "middleware/withAuthentication/getUserFromCookie"
import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSideProps from "types/AuthenticationServerSideProps"
import User from "types/User"

it("should include current user in the context when successfully get the user", async () => {
  const expectedUser = { username: "dummy", emailAddress: "dummy@dummy.com" } as Partial<User>
  const mockedGetUserFormCookie = getUserFromCookie as jest.MockedFunction<typeof getUserFromCookie>
  mockedGetUserFormCookie.mockReturnValue(expectedUser)
  const dummyContext = { req: {} } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req } = context as AuthenticationServerSideProps

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
  const mockedGetUserFormCookie = getUserFromCookie as jest.MockedFunction<typeof getUserFromCookie>
  mockedGetUserFormCookie.mockReturnValue(new Error("Error"))
  const dummyContext = { req: {} } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req } = context as AuthenticationServerSideProps

    expect(req).toBeDefined()
    expect(currentUser).toBeUndefined()
    return undefined as never
  })

  await handler(dummyContext)
})
