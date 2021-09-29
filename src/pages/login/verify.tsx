import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
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
import addQueryParams from "utils/addQueryParams"
import { ErrorSummaryList } from "components/ErrorSummary"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, res, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  const redirectUrl = getValidRedirectUrl(query, config)

  let redirectParams: { [key: string]: string } = {}
  const authenticationErrorMessage = "Error authenticating the reqest"

  if (redirectUrl) {
    redirectParams = { redirectUrl: redirectUrl as string }
  }

  const notYourEmailAddressUrl = addQueryParams("/login", {
    notYou: "true",
    ...redirectParams
  })

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
            invalidVerification: true,
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

      if (!redirectUrl) {
        return createRedirectResponse("/home")
      }

      const url = addQueryParams(redirectUrl as string, {
        [config.tokenQueryParamName]: authToken
      })

      return createRedirectResponse(url)
    }

    const { token } = query as { token: EmailVerificationToken }
    const translatedToken = decodeEmailVerificationToken(token)
    if (isError(translatedToken)) {
      return {
        props: {
          invalidVerification: true,
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
            <p>
              {"This link is either incorrect or may have expired. Please "}
              <Link href="/login">{"try signing in again"}</Link>
              {" with your email address to receive another link."}
            </p>
            <p>
              {"If you still have an issue with signing in to your account you will need to "}
              <Link href={config.contactUrl}>{"contact us"}</Link>
              {"."}
            </p>
          </ErrorSummary>
        )}

        {invalidCredentials && (
          <ErrorSummary title="Your details do not match" show={invalidCredentials}>
            <ErrorSummaryList
              items={[{ id: "password", error: "Enter a valid email address and password combination" }]}
            />
          </ErrorSummary>
        )}

        {!invalidVerification && (
          <p className="govuk-body">
            <Form method="post" csrfToken={csrfToken}>
              {"You are signing in as "}
              <b>{emailAddress}</b>
              {"."}
              <p>
                {"If this is not your account, you can "}
                <Link href={notYourEmailAddressUrl} data-test="not-you-link">
                  {"sign in with your email address"}
                </Link>
                {"."}
              </p>

              <TextInput
                name="password"
                label="Password"
                type="password"
                error={invalidCredentials && "Password is not valid"}
              />

              <div className="govuk-form-group">
                <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
                  <legend className="govuk-fieldset__legend">
                    {"Do you want your email address to be remembered?"}
                  </legend>
                  <div className="govuk-hint">
                    {
                      "You will not be asked to verify your email address for 24 hours on this browser. Do not choose 'Yes' if you do not trust this device."
                    }
                  </div>
                  <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id="rememberEmailYes"
                        name="rememberEmailAddress"
                        type="checkbox"
                        value="yes"
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor="rememberEmailYes">
                        {"Yes, remember my email address."}
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>

              <input type="hidden" id="token" name="token" value={token} />
              <Button>{"Sign in"}</Button>
            </Form>
          </p>
        )}
      </GridRow>
    </Layout>
  </>
)

export default VerifyEmail
