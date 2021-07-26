import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"

// eslint-disable-next-line require-await
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let invalidVerification = false

  const { emailAddress, verificationCode } = query

  if (!emailAddress || !verificationCode) {
    invalidVerification = true
  }

  return {
    props: {
      emailAddress,
      invalidVerification
    }
  }
}

interface Props {
  emailAddress?: string
  invalidVerification?: boolean
}

const VerifyEmail = ({ emailAddress, invalidVerification }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {invalidVerification && (
          <ErrorSummary title="Unable to verify email address">
            {"This link is either incorrect or may have expired. Please try again."}
          </ErrorSummary>
        )}

        {!invalidVerification && (
          <form action="/" method="post">
            <p className="govuk-body">
              {"You are signing in as "}
              <b>{emailAddress}</b>
              {"."}
            </p>
            <TextInput id="password" name="password" label="Password" type="password" />
            <Button>{"Sign in"}</Button>
          </form>
        )}
      </GridRow>
    </Layout>
  </>
)

export default VerifyEmail
