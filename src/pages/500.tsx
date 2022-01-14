import ContactLink from "components/ContactLink"
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
        <h1 className="govuk-heading-xl">{"Sorry, there is a problem with the service"}</h1>

        <Paragraph>{"Try again later."}</Paragraph>
        <Paragraph>
          <ContactLink>{"Contact support"}</ContactLink>
          {" if you have repeated problems with the service."}
        </Paragraph>
      </GridRow>
    </Layout>
  </>
)

export default Custom500
