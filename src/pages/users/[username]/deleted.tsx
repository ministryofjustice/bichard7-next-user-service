import Layout from "components/Layout"
import Head from "next/head"
import BackLink from "components/BackLink"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = ({ query }) => {
  const { name } = query

  const result = {
    props: {
      name: String(name)
    }
  }

  return Promise.resolve(result)
}

interface Props {
  name: string
}

const Deleted = ({ name }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <BackLink href="/users" />

      <SuccessBanner message={`User '${name}' has been deleted successfully.`} />
    </Layout>
  </>
)

export default Deleted
