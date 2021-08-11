import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import isError from "lib/isError"
import config from "lib/config"
import { decodeEmailToken, EmailToken } from "lib/token/emailToken"
import getConnection from "lib/getConnection"
import { authenticate } from "useCases"
import { generateBichardToken } from "lib/token/bichardToken"

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  try {
    if (req.method === "POST") {
      const { token, password } = (await parseFormData(req)) as { token: EmailToken; password: string }
      const { emailAddress, verificationCode } = decodeEmailToken(token)

      const connection = getConnection()
      const user = await authenticate(connection, emailAddress, password, verificationCode)

      if (isError(user)) {
        console.error(user)
        return {
          props: {
            invalidCredentials: true,
            emailAddress,
            token
          }
        }
      }

      const bichardToken = generateBichardToken(user)

      const url = new URL(config.bichardRedirectURL)
      url.searchParams.append(config.tokenQueryParamName, bichardToken)

      return {
        redirect: {
          destination: url.href,
          statusCode: 302
        }
      }
    }

    const { token } = query as { token: EmailToken }
    const { emailAddress } = decodeEmailToken(token)

    if (!token || !emailAddress) {
      throw new Error()
    }

    return { props: { emailAddress, token } }
  } catch {
    return { props: { invalidVerification: true } }
  }
}

interface Props {
  emailAddress?: string
  invalidCredentials?: boolean
  invalidVerification?: boolean
  token?: string
}

const VerifyEmail = ({ emailAddress, invalidCredentials, invalidVerification, token }: Props) => (
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
            <input type="hidden" id="token" name="token" value={token} />
            <Button>{"Sign in"}</Button>
          </form>
        )}
      </GridRow>
    </Layout>
  </>
)

export default VerifyEmail
