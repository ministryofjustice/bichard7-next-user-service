import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import {
  authenticate,
  getEmailAddressFromCookie,
  removeEmailAddressCookie,
  signInUser,
  storeEmailAddressInCookie
} from "useCases"
import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import Link from "components/Link"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import getRedirectPath from "lib/getRedirectPath"
import config from "lib/config"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import isPost from "utils/isPost"
import { ParsedUrlQuery } from "querystring"
import { ErrorSummaryList } from "components/ErrorSummary"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import getAuditLogger from "lib/getAuditLogger"
import getFailedPasswordAttempts from "useCases/getFailedPasswordAttempts"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"

const authenticationErrorMessage = "Error authenticating the reqest"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res, formData, csrfToken, query, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    if (currentUser) {
      return createRedirectResponse("/")
    }

    if (isPost(req)) {
      const { emailAddress, validationCode, loginStage, password, rememberEmailAddress } = formData as {
        emailAddress: string
        secretCode: string
        validationCode: string
        loginStage: string
        password: string
        rememberEmailAddress: string
      }
      const connection = getConnection()
      const redirectPath = getRedirectPath(query)

      if (loginStage === "email") {
        if (!emailAddress.match(/\S+@\S+\.\S+/)) {
          return {
            props: {
              csrfToken,
              emailAddress,
              emailError: "Enter a valid email address"
            }
          }
        }

        const sent = await sendVerificationCodeEmail(connection, emailAddress)

        if (isError(sent)) {
          console.error(sent)
          return {
            props: { csrfToken, emailAddress, sendingError: true }
          }
        }

        return {
          props: {
            csrfToken,
            emailAddress,
            loginStage: "validateCode"
          }
        }
      }

      if (loginStage === "validateCode") {
        const auditLogger = getAuditLogger(context, config)
        const user = await authenticate(connection, auditLogger, emailAddress, password, validationCode)

        if (isError(user)) {
          console.error("Error logging in: ", user.message)
          const attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
          if (!isError(attemptsSoFar) && attemptsSoFar >= config.maxPasswordFailedAttempts) {
            return {
              props: {
                emailAddress,
                csrfToken,
                loginStage: "email",
                tooManyPasswordAttempts: true
              }
            }
          }
          return {
            props: {
              invalidCredentials: true,
              emailAddress,
              csrfToken,
              loginStage: "validateCode",
              validationCode
            }
          }
        }

        const authToken = await signInUser(connection, res, user)

        if (isError(authToken)) {
          console.error(authToken)
          throw new Error(authenticationErrorMessage)
        }

        if (rememberEmailAddress === "yes") {
          const emailAddressFromCookie = getEmailAddressFromCookie(req, config)

          if (!emailAddressFromCookie || emailAddressFromCookie !== emailAddress) {
            storeEmailAddressInCookie(res, config, emailAddress)
          }
        } else {
          removeEmailAddressCookie(res, config)
        }

        if (redirectPath) {
          return createRedirectResponse(redirectPath, { basePath: false })
        }

        return createRedirectResponse("/")
      }
    }

    return {
      props: { csrfToken, loginStage: "email" }
    }
  }
)

interface Props {
  emailAddress?: string
  emailError?: string
  csrfToken: string
  sendingError?: boolean
  loginStage?: string
  invalidCredentials?: boolean
  validationCode?: string
  tooManyPasswordAttempts?: boolean
}

const Index = ({
  emailAddress,
  emailError,
  csrfToken,
  sendingError,
  loginStage,
  validationCode,
  invalidCredentials,
  tooManyPasswordAttempts
}: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        <ErrorSummary title="There is a problem" show={!!sendingError}>
          <p>
            {"There is a problem signing in "}
            <b>{emailAddress}</b>
            {"."}
          </p>
          <p>
            {"Please try again or "}
            <Link href={config.contactUrl}>{"contact support"}</Link>
            {" to report this issue."}
          </p>
        </ErrorSummary>

        <ErrorSummary title="There is a problem" show={!!emailError}>
          <ErrorSummaryList items={[{ id: "email", error: emailError }]} />
        </ErrorSummary>

        <ErrorSummary title="There is a problem" show={!!tooManyPasswordAttempts}>
          <p>{"Too many incorrect password attempts. Please try signing in again."}</p>
        </ErrorSummary>

        {invalidCredentials && (
          <ErrorSummary title="Your details do not match" show={invalidCredentials}>
            <ErrorSummaryList
              items={[
                { id: "password", error: "Enter a valid code and password combination." },
                {
                  error: (
                    <>
                      {"Please wait "}
                      <b>
                        {config.incorrectDelay}
                        {" seconds"}
                      </b>
                      {" before trying again."}
                    </>
                  )
                }
              ]}
            />
          </ErrorSummary>
        )}

        {loginStage === "email" && (
          <Form method="post" csrfToken={csrfToken}>
            <input type="hidden" name="loginStage" value="email" />
            <TextInput
              id="email"
              name="emailAddress"
              label="Email address"
              type="email"
              error={emailError}
              value={emailAddress}
            />
            <Button>{"Sign in"}</Button>
          </Form>
        )}
        {loginStage === "validateCode" && (
          <Form method="post" csrfToken={csrfToken}>
            <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
            <input type="hidden" name="loginStage" value="validateCode" />
            <TextInput
              id="validationCode"
              name="validationCode"
              label="Enter the 6 character code you have been sent via email"
              type="text"
              value={validationCode}
            />
            <TextInput name="password" label="Password" type="password" />
            <Button>{"Sign in"}</Button>
          </Form>
        )}
        <p>
          <Link href="/login/forgot-password" data-test="forgot-password">
            {"I have forgotten my password"}
          </Link>
        </p>
      </GridRow>
    </Layout>
  </>
)

export default Index
