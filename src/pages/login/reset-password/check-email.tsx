import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import NotReceivedEmail from "components/NotReceivedEmail"

const CheckEmail = () => (
  <>
    <Head>
      <title>{"Forgot Password"}</title>
    </Head>
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <BackLink href="/" />

          <h1 data-test="check-email" className="govuk-heading-xl">
            {"Check your email"}
          </h1>

          <p className="govuk-body">
            <p>{"If an account was found we will have sent you an email."}</p>
            <p>{"Instructions on how to reset your password have been sent to your email address."}</p>
            <NotReceivedEmail sendAgainUrl="/login/forgot-password" />
          </p>
        </div>
      </div>
    </Layout>
  </>
)

export default CheckEmail
