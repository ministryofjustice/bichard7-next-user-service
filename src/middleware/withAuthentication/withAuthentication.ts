import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSideProps from "types/AuthenticationServerSideProps"
import { isError, Result } from "types/Result"
import User from "types/User"
import getUserFromCookie from "./getUserFromCookie"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context

    let currentUser: Result<Partial<User>> | undefined = getUserFromCookie(req)

    if (isError(currentUser)) {
      currentUser = undefined
    }

    return Promise.resolve(getServerSidePropsFunction({ ...context, currentUser } as AuthenticationServerSideProps))
  }

  return result
}
