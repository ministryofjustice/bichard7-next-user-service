import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import getConnection from "lib/getConnection"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { signOutUser } from "useCases"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<unknown>> => {
    const { req, res } = context as AuthenticationServerSidePropsContext
    const connection = getConnection()
    await signOutUser(connection, res, req)
    return { props: {} }
  }
)

const Index = () => (
  <>
    <Head>
      <title>{"Signed out of Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Signed out of Bichard 7"}</h1>

        <p className="govuk-body">
          <p>{"You have been signed out of your account."}</p>
          <p>
            {"In order to sign back in, please click "}
            <Link href="/login" data-test="log-back-in">
              {"here"}
            </Link>
            {"."}
          </p>
        </p>
      </GridRow>
    </Layout>
  </>
)

export default Index
