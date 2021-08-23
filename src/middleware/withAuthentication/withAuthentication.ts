import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError, Result } from "types/Result"
import User from "types/User"
import getUserFromCookie from "./getUserFromCookie"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context

    let currentUser: Result<Partial<User>> | null = getUserFromCookie(req)

    if (isError(currentUser)) {
      currentUser = null
    }

    return Promise.resolve(
      getServerSidePropsFunction({ ...context, currentUser } as AuthenticationServerSidePropsContext)
    )
  }

  return result
}
