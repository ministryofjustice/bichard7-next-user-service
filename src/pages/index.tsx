import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import { UserCredentials } from "lib/User"
import Auth from "@aws-amplify/auth"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const props: Props = {}

  if (req.method === "POST") {
    const credentials: UserCredentials = (await parseFormData(req)) as { emailAddress: string; password: string }

    if (credentials.emailAddress && credentials.password) {
      try {
        const user = await Auth.signIn(credentials.emailAddress, credentials.password)
        const idToken = user.getSignInUserSession()?.getIdToken()
        props.token = idToken?.getJwtToken()
        props.tokenContents = JSON.stringify(idToken?.decodePayload(), null, 4)
      } catch (error) {
        console.log(error)
        props.invalidCredentials = true
      }
    } else {
      props.invalidCredentials = true
    }
  }

  return { props }
}

interface Props {
  invalidCredentials?: boolean
  token?: string
  tokenContents?: string
}

const Index = ({ invalidCredentials, token, tokenContents }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {invalidCredentials && (
          <ErrorSummary title="Invalid credentials">
            {"The supplied email address and password are not valid."}
          </ErrorSummary>
        )}

        <form action="/" method="post">
          <TextInput id="email" name="emailAddress" label="Email address" type="email" />
          <TextInput id="password" name="password" label="Password" type="password" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
      {token && (
        <>
          <GridRow>
            <code style={{ wordWrap: "break-word" }}>{token}</code>
          </GridRow>
          <GridRow>
            <pre>{tokenContents}</pre>
          </GridRow>
        </>
      )}
    </Layout>
  </>
)

export default Index
