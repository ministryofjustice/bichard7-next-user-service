import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import User from "./User"

type AuthenticationServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser?: Partial<User>
}

export default AuthenticationServerSidePropsContext
