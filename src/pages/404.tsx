import ContactLink from "components/ContactLink"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"

const Custom404 = () => (
  <>
    <Head>
      <title>{"Page not found"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 data-test="404_header" className="govuk-heading-xl">
          {"Page not found"}
        </h1>

        <p className="govuk-body">{"If you typed the web address, check it is correct."}</p>
        <p className="govuk-body">{"If you pasted the web address, check you copied the entire address."}</p>
        <p className="govuk-body">
          {"If the web address is correct or you selected a link or button, "}
          <ContactLink>{"contact support"}</ContactLink>
          {"."}
        </p>
      </GridRow>
    </Layout>
  </>
)

export default Custom404
