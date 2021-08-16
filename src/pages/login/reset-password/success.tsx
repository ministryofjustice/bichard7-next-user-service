import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import SuccessBanner from "components/SuccessBanner"

const Success = () => (
  <>
    <Head>
      <title>{"Password Changed"}</title>
    </Head>
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <BackLink href="/" />

          <SuccessBanner message={`You can now sign in with your new password.`} />
        </div>
      </div>
    </Layout>
  </>
)

export default Success
