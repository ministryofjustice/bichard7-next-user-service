import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import Authenticator from "lib/Authenticator"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import { isSuccess, UserCredentials } from "lib/User"
import config from "lib/config"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let invalidCredentials = false

  if (req.method === "POST") {
    const credentials: UserCredentials = (await parseFormData(req)) as { emailAddress: string; password: string }

    if (credentials.emailAddress && credentials.password) {
      const result = Authenticator.authenticate(credentials)

      if (isSuccess(result)) {
        return {
          redirect: {
            destination: config.bichardRedirectURL,
            permanent: false
          }
        }
      }
    }

    invalidCredentials = true
  }

  return {
    props: { invalidCredentials }
  }
}

interface Props {
  invalidCredentials?: boolean
}

const Index = ({ invalidCredentials }: Props) => (
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
    </Layout>
  </>
)

export default Index
