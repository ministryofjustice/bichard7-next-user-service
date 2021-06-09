import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import { GetServerSideProps } from "next"

// eslint-disable-next-line require-await
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { token } = query as { token: string }

  if (token) {
    return {
      props: {
        token: query.token
      }
    }
  }
  return {
    redirect: {
      destination: "/",
      statusCode: 302
    }
  }
}

interface Props {
  token: string
}

const Authed = ({ token }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Authenticated!"}</h1>

        <div className="govuk-body">
          <p>{"You're signed in."}</p>
          <code style={{ wordBreak: "break-all" }}>{token}</code>
        </div>
      </GridRow>
    </Layout>
  </>
)

export default Authed
