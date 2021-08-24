import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import User from "types/User"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, currentUser } = context as AuthenticationServerSidePropsContext
    const { name } = query

    const result = {
      props: {
        name: String(name),
        currentUser
      }
    }

    return Promise.resolve(result)
  }
)

interface Props {
  name: string
  currentUser?: Partial<User>
}

const Deleted = ({ name, currentUser }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout user={currentUser}>
      <BackLink href="/users" />

      <SuccessBanner message={`User '${name}' has been deleted successfully.`} />
    </Layout>
  </>
)

export default Deleted
