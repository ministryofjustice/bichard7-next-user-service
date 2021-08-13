import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"

const CheckEmail = () => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <BackLink href="/" />

          <h1 data-test="check-email" className="govuk-heading-xl">
            {"Check your email"}
          </h1>

          <p className="govuk-body">{"Please follow the instructions in the email in order to reset your password."}</p>
        </div>
      </div>
    </Layout>
  </>
)

export default CheckEmail
