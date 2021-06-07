import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import Auth from "@aws-amplify/auth"

interface Props {
  invalidCredentials?: boolean
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const props: Props = {}

  if (req.method === "POST") {
    const { emailAddress } = (await parseFormData(req)) as { emailAddress: string }

    if (emailAddress) {
      try {
        await Auth.signIn(emailAddress)

        return {
          redirect: {
            destination: "/verify",
            statusCode: 302
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    props.invalidCredentials = true
  }

  return { props }
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
          <ErrorSummary title="Invalid email address">{"The supplied email address is not valid."}</ErrorSummary>
        )}

        <form action="/" method="post">
          <TextInput id="email" name="emailAddress" label="Email address" type="email" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Index
