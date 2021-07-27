import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let invalidEmail = false

  if (req.method === "POST") {
    const formData = (await parseFormData(req)) as { emailAddress: string }

    if (formData.emailAddress) {
      return {
        redirect: {
          destination: "/login/check-email",
          statusCode: 302
        }
      }
    }

    invalidEmail = true
  }

  return {
    props: { invalidEmail }
  }
}

interface Props {
  invalidEmail?: boolean
}

const Index = ({ invalidEmail }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {invalidEmail && (
          <ErrorSummary title="Invalid email">{"The supplied email address is not valid."}</ErrorSummary>
        )}

        <form method="post">
          <TextInput id="email" name="emailAddress" label="Email address" type="email" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Index
