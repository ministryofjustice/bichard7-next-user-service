import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import config from "lib/config"
import Head from "next/head"

const AccessDenied = () => (
  <>
    <Head>
      <title>{"Page not found"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Access denied"}</h1>

        <p className="govuk-body">{"You do not have permission to access this page."}</p>
        <p className="govuk-body">
          {"We suggest that you return to the "}
          <Link href="/">{"home page"}</Link>
          {" or "}
          <Link href={config.contactUrl}>{"contact support"}</Link>
          {" to request access."}
        </p>
      </GridRow>
    </Layout>
  </>
)

export default AccessDenied