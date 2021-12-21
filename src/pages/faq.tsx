import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"

export const getServerSideProps = () => {
  return {
    props: {}
  }
}

const faq = () => (
  <>
    <Head>
      <title>{"FAQ"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"FAQ"}</h1>
      </GridRow>
    </Layout>
  </>
)

export default faq
