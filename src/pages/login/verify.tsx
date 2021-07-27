import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import { UserCredentials } from "lib/User"
import parseFormData from "lib/parseFormData"
import { isSuccess } from "lib/AuthenticationResult"
import config from "lib/config"
import Authenticator from "lib/Authenticator"

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  let invalidCredentials = false
  let invalidVerification = false

  const { emailAddress, verificationCode } = query

  if (req.method === "POST") {
    const credentials: UserCredentials = (await parseFormData(req)) as { emailAddress: string; password: string }

    if (credentials.emailAddress && credentials.password) {
      const result = await Authenticator.authenticate(credentials)

      if (isSuccess(result)) {
        const token = result
        const url = new URL(config.bichardRedirectURL)
        url.searchParams.append(config.tokenQueryParamName, token)

        return {
          redirect: {
            destination: url.href,
            statusCode: 302
          }
        }
      }
    }

    invalidCredentials = true
  } else if (!emailAddress || !verificationCode) {
    invalidVerification = true
  }

  return {
    props: {
      emailAddress,
      invalidCredentials,
      invalidVerification
    }
  }
}

interface Props {
  emailAddress?: string
  invalidCredentials?: boolean
  invalidVerification?: boolean
}

const VerifyEmail = ({ emailAddress, invalidCredentials, invalidVerification }: Props) => (
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

        {invalidCredentials && (
          <ErrorSummary title="Invalid credentials">
            {"The supplied email address and password are not valid."}
          </ErrorSummary>
        )}

        {!invalidVerification && (
          <form method="post">
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
