import ContactLink from "components/ContactLink"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Paragraph from "components/Paragraph"
import Head from "next/head"

const Custom404 = () => (
  <>
    <Head>
      <title>{"Page not found"}</title>
    </Head>
    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 data-test="404_header" className="govuk-heading-xl">
            {"Page not found"}
          </h1>

          <Paragraph>{"If you typed the web address, check it is correct."}</Paragraph>
          <Paragraph>{"If you pasted the web address, check you copied the entire address."}</Paragraph>
          <Paragraph>
            {"If the web address is correct or you selected a link or button, "}
            <ContactLink>{"contact support"}</ContactLink>
            {"."}
          </Paragraph>
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default Custom404
