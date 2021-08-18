import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import config from "lib/config"
import { decodeEmailVerificationToken, EmailVerificationToken } from "lib/token/emailVerificationToken"
import getConnection from "lib/getConnection"
import { authenticate } from "useCases"
import { generateAuthenticationToken } from "lib/token/authenticationToken"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  try {
    if (req.method === "POST") {
      const { token, password } = (await parseFormData(req)) as { token: EmailVerificationToken; password: string }
      const translatedToken = decodeEmailVerificationToken(token)
      if (isError(translatedToken)) {
        return {
          props: {
            invalidCredentials: true
          }
        }
      }
      const { emailAddress, verificationCode } = translatedToken

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

      const authToken = generateAuthenticationToken(user)

      const url = new URL(config.bichardRedirectURL)
      url.searchParams.append(config.tokenQueryParamName, authToken)

      return createRedirectResponse(url.href)
    }

    const { token } = query as { token: EmailVerificationToken }
    const translatedToken = decodeEmailVerificationToken(token)
    if (isError(translatedToken)) {
      return {
        props: {
          invalidCredentials: true
        }
      }
    }
    const { emailAddress } = translatedToken

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
