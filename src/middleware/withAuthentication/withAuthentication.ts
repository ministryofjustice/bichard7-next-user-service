import getConnection from "lib/getConnection"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isSuccess } from "types/Result"
import User from "types/User"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import getAuthenticationPayloadFromCookie from "./getAuthenticationPayloadFromCookie"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context

    const authentication = getAuthenticationPayloadFromCookie(req)
    let currentUser: User | null = null

    if (authentication) {
      const connection = getConnection()
      const user = await getUserByEmailAddress(connection, authentication.emailAddress)

      if (isSuccess(user)) {
        currentUser = user
      } else {
        console.error(user)
      }
    }

    return getServerSidePropsFunction({
      ...context,
      currentUser,
      authentication
    } as AuthenticationServerSidePropsContext)
  }

  return result
}
