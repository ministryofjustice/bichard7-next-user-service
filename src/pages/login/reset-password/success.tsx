import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import SuccessBanner from "components/SuccessBanner"
import Link from "components/Link"

const Success = () => (
  <>
    <Head>
      <title>{"Password Changed"}</title>
    </Head>
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <BackLink href="/" />

          <SuccessBanner>
            {`You can now `}
            <Link href="/">{`sign in with your new password`}</Link>
            {`.`}
          </SuccessBanner>
        </div>
      </div>
    </Layout>
  </>
)

export default Success
