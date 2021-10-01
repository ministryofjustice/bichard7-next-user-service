import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import NotReceivedEmail from "components/NotReceivedEmail"
import Head from "next/head"

const CheckEmail = () => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 data-test="check-email" className="govuk-heading-xl">
          {"Check your email"}
        </h1>

        <p className="govuk-body">
          <p>
            {"If an account was found we will have sent you an email via "}
            <Link href="https://www.cjsm.net/">{"CJSM"}</Link>
            {"."}
          </p>
          <p>
            {"In order to log in, you need to click the verification link that has been sent to your email address."}
          </p>
          <NotReceivedEmail sendAgainUrl="/login" />
        </p>
      </GridRow>
    </Layout>
  </>
)

export default CheckEmail
