import { GetServerSidePropsContext } from "next"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import config from "lib/config"
import Head from "next/head"

export const getServerSideProps = ({ res }: GetServerSidePropsContext) => {
  res.statusCode = 403
  return {
    props: {}
  }
}

const AccessDenied = () => (
  <>
    <Head>
      <title>{"Access denied"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Access denied"}</h1>

        <p className="govuk-body">{"You do not have permission to access this page."}</p>
        <p className="govuk-body">
          {"We suggest that you return to the "}
          <Link href="/">{"home page"}</Link>
          {" and choose an available service to you."}
        </p>
        <p className="govuk-body">
          {"If you believe you have permission to access this page, you can "}
          <Link href={config.contactUrl}>{"contact support"}</Link>
          {" to report this issue."}
        </p>
      </GridRow>
    </Layout>
  </>
)

export default AccessDenied
