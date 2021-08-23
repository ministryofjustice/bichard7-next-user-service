import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import User from "./User"

type AuthenticationServerSideProps = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser?: Partial<User>
}

export default AuthenticationServerSideProps
