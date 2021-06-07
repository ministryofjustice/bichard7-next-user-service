import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import { GetServerSideProps } from "next"
import Auth from "@aws-amplify/auth"

interface Props {
  failure?: boolean
  token?: string
  tokenContents?: string
}

export const getServerSideProps: GetServerSideProps = async () => {
  const props: Props = {}

  try {
    const user = await Auth.currentAuthenticatedUser()
    const idToken = user.getSignInUserSession()?.getIdToken()
    props.token = idToken?.getJwtToken()
    props.tokenContents = JSON.stringify(idToken?.decodePayload(), null, 4)
  } catch (error) {
    console.log(error)
    props.failure = true
  }

  return { props }
}

const Token = ({ failure, token, tokenContents }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      {failure && (
        <GridRow>
          <ErrorSummary title="Failed to get token">{"There was a problem getting the token"}</ErrorSummary>
        </GridRow>
      )}

      {token && (
        <GridRow>
          <code style={{ wordWrap: "break-word" }}>{token}</code>
        </GridRow>
      )}

      {tokenContents && (
        <GridRow>
          <pre>{tokenContents}</pre>
        </GridRow>
      )}
    </Layout>
  </>
)

export default Token
