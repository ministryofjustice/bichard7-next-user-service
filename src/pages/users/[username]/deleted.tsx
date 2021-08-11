import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"

const Deleted = () => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <BackLink href="/users" />

          <h1 className="govuk-heading-l">{"Deleted"}</h1>
          <p className="govuk-body">{"User has been deleted successfully."}</p>
        </div>
      </div>
    </Layout>
  </>
)

export default Deleted
