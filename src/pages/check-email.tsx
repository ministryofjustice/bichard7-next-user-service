import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"

const CheckEmail = () => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Check your email"}</h1>
        <p className="govuk-body">
          {"In order to log in, you need to click the verification link that has been sent to your email address."}
        </p>
      </GridRow>
    </Layout>
  </>
)

export default CheckEmail
