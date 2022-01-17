import ContactLink from "components/ContactLink"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Paragraph from "components/Paragraph"
import Head from "next/head"

const Custom500 = () => (
  <>
    <Head>
      <title>{"Sorry, there is a problem with the service"}</title>
    </Head>
    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 className="govuk-heading-xl">{"Sorry, there is a problem with the service"}</h1>

          <Paragraph>{"Try again later."}</Paragraph>
          <Paragraph>
            <ContactLink>{"Contact support"}</ContactLink>
            {" if you have repeated problems with the service."}
          </Paragraph>
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default Custom500
