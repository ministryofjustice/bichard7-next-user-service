import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import config from "lib/config"
import Head from "next/head"

const Custom404 = () => (
  <>
    <Head>
      <title>{"Page not found"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Page not found"}</h1>

        <p className="govuk-body">{"If you typed the web address, check it is correct."}</p>
        <p className="govuk-body">{"If you pasted the web address, check you copied the entire address."}</p>
        <p className="govuk-body">
          {"If the web address is correct or you selected a link or button, "}
          <Link href={config.contactUrl}>{"contact support"}</Link>
          {"."}
        </p>
      </GridRow>
    </Layout>
  </>
)

export default Custom404
