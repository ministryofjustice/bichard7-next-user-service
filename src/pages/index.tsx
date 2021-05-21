import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { authenticate } from "lib/authentication"
import { GetServerSideProps } from "next"
import parse from "urlencoded-body-parser"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let invalidCredentials = false

  if (req.method === "POST") {
    const { email, password } = await parse(req)
    const user = authenticate({ emailAddress: email, password })

    if (user.loggedIn) {
      return {
        redirect: {
          destination: "https://localhost:9443/bichard-ui/",
          permanent: false
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
          <TextInput id="email" name="email" label="Email address" type="email" />
          <TextInput id="password" name="password" label="Password" type="password" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Index
