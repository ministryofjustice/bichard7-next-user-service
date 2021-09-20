import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import config from "lib/config"
import { decodeEmailVerificationToken, EmailVerificationToken } from "lib/token/emailVerificationToken"
import getConnection from "lib/getConnection"
import {
  authenticate,
  getEmailAddressFromCookie,
  removeEmailAddressCookie,
  signInUser,
  storeEmailAddressInCookie
} from "useCases"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import getValidRedirectUrl from "lib/getRedirectUrl"
import { withCsrf } from "middleware"
import Link from "components/Link"
import { GetServerSidePropsResult } from "next"
import isPost from "utils/isPost"
import getAuditLogger from "lib/getAuditLogger"
import User from "types/User"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, res, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  const redirectUrl = getValidRedirectUrl(query, config)
  const notYourEmailAddressUrlObject = new URL(`/login`, config.baseUrl)
  const authenticationErrorMessage = "Error authenticating the reqest"

  if (redirectUrl) {
    notYourEmailAddressUrlObject.searchParams.append("redirectUrl", redirectUrl as string)
  }

  notYourEmailAddressUrlObject.searchParams.append("notYou", "true")
  const notYourEmailAddressUrl = notYourEmailAddressUrlObject.href

  try {
    if (isPost(req)) {
      const { token, password, rememberEmailAddress } = formData as {
        token: EmailVerificationToken
        password: string
        rememberEmailAddress: string
      }

      const translatedToken = decodeEmailVerificationToken(token)

      if (isError(translatedToken)) {
        console.error(translatedToken)
        return {
          props: {
            invalidCredentials: true,
            csrfToken,
            notYourEmailAddressUrl
          }
        }
      }
      const { emailAddress, verificationCode } = translatedToken

      const connection = getConnection()
      const auditLogger = getAuditLogger(context, config)
      const user = await authenticate(connection, auditLogger, emailAddress, password, verificationCode)

      if (isError(user)) {
        console.error(user)
        return {
          props: {
            invalidCredentials: true,
            emailAddress,
            token,
            csrfToken,
            notYourEmailAddressUrl
          }
        }
      }

      const bichardUrl = redirectUrl || config.bichardRedirectURL
      const authToken = await signInUser(connection, res, user as unknown as User)

      if (isError(authToken)) {
        console.error(authToken)
        throw new Error(authenticationErrorMessage)
      }

      if (rememberEmailAddress === "remember-email") {
        const emailAddressFromCookie = getEmailAddressFromCookie(req, config)

        if (!emailAddressFromCookie || emailAddressFromCookie !== emailAddress) {
          storeEmailAddressInCookie(res, config, emailAddress)
        }
      } else {
        removeEmailAddressCookie(res, config)
      }

      const url = new URL(bichardUrl as string)
      url.searchParams.append(config.tokenQueryParamName, authToken)

      return createRedirectResponse(url.href)
    }

    const { token } = query as { token: EmailVerificationToken }
    const translatedToken = decodeEmailVerificationToken(token)
    if (isError(translatedToken)) {
      return {
        props: {
          invalidCredentials: true,
          csrfToken,
          notYourEmailAddressUrl
        }
      }
    }

    const { emailAddress } = translatedToken

    if (!token || !emailAddress) {
      throw new Error()
    }

    return { props: { emailAddress, token, csrfToken, notYourEmailAddressUrl } }
  } catch (error) {
    if ((error as Error).message === authenticationErrorMessage) {
      throw error
    }
    return { props: { invalidVerification: true, csrfToken, notYourEmailAddressUrl } }
  }
})

interface Props {
  emailAddress?: string
  invalidCredentials?: boolean
  invalidVerification?: boolean
  notYourEmailAddressUrl: string
  token?: string
  csrfToken: string
}

const VerifyEmail = ({
  emailAddress,
  invalidCredentials,
  invalidVerification,
  notYourEmailAddressUrl,
  token,
  csrfToken
}: Props) => (
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
          <Form method="post" csrfToken={csrfToken}>
            <p className="govuk-body">
              {"You are signing in as "}
              <b>{emailAddress}</b>
              {"."}
            </p>
            <p>
              <Link href={notYourEmailAddressUrl} data-test="not-you-link">
                {"Not your account? Click here to login with a different email address"}
              </Link>
            </p>
            <TextInput id="password" name="password" label="Password" type="password" />
            <p>
              <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="rememberEmailAddress"
                    name="rememberEmailAddress"
                    type="checkbox"
                    value="remember-email"
                  />
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="rememberEmailAddress">
                    {"Remember my email address"}
                  </label>
                </div>
              </div>
            </p>
            <input type="hidden" id="token" name="token" value={token} />
            <Button>{"Sign in"}</Button>
          </Form>
        )}
      </GridRow>
    </Layout>
  </>
)

export default VerifyEmail
