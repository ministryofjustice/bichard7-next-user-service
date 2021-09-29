import getConnection from "lib/getConnection"
import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError, Result } from "types/Result"
import User from "types/User"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import getAuthenticationPayloadFromCookie from "./getAuthenticationPayloadFromCookie"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context

    let authentication: Result<AuthenticationTokenPayload> | null = getAuthenticationPayloadFromCookie(req)

    if (isError(authentication)) {
      console.error(authentication)
      authentication = null
    }

    const connection = getConnection()
    let currentUser: Result<User | null> | null =
      authentication && (await getUserByEmailAddress(connection, authentication.emailAddress))

    if (isError(currentUser)) {
      console.error(currentUser)
      currentUser = null
    }

    return getServerSidePropsFunction({
      ...context,
      currentUser,
      authentication
    } as AuthenticationServerSidePropsContext)
  }

  return result
}
