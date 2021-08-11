import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import SuccessBanner from "components/SuccessBanner"

const Deleted = () => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <BackLink href="/users" />

      <SuccessBanner message={"User has been deleted successfully."} />
    </Layout>
  </>
)

export default Deleted
