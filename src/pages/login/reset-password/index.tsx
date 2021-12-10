import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import { GetServerSidePropsResult } from "next"
import { decodePasswordResetToken } from "lib/token/passwordResetToken"
import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import resetPassword, { ResetPasswordOptions } from "useCases/resetPassword"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import passwordSecurityCheck from "useCases/passwordSecurityCheck"
import { withCsrf } from "middleware"
import generateRandomPassword from "useCases/generateRandomPassword"
import SuggestPassword from "components/SuggestPassword"
import config from "lib/config"
import { isPost } from "utils/http"
import getAuditLogger from "lib/getAuditLogger"
import addQueryParams from "utils/addQueryParams"
import { ErrorSummaryList } from "components/ErrorSummary"
import Link from "components/Link"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  const { token, suggestPassword } = query as { token: string; suggestPassword: string }
  const suggestedPasswordUrl = addQueryParams("/login/reset-password", {
    token,
    suggestPassword: "true"
  })

  const payload = decodePasswordResetToken(token)
  let suggestedPassword = ""

  if (isError(payload)) {
    return {
      props: {
        token,
        invalidToken: true,
        csrfToken,
        suggestedPassword,
        suggestedPasswordUrl
      }
    }
  }

  if (isPost(req)) {
    const { newPassword, confirmPassword } = formData as {
      newPassword: string
      confirmPassword: string
    }

    if (!newPassword) {
      return {
        props: {
          token,
          invalidPassword: true,
          csrfToken,
          suggestedPassword,
          suggestedPasswordUrl
        }
      }
    }

    if (newPassword !== confirmPassword) {
      return {
        props: {
          token,
          passwordsMismatch: true,
          csrfToken,
          suggestedPassword,
          suggestedPasswordUrl
        }
      }
    }

    const passwordCheckResult = passwordSecurityCheck(newPassword)
    if (isError(passwordCheckResult)) {
      return {
        props: {
          token,
          passwordInsecure: true,
          passwordInsecureMessage: passwordCheckResult.message,
          csrfToken,
          suggestedPassword,
          suggestedPasswordUrl
        }
      }
    }

    const connection = getConnection()
    const auditLogger = getAuditLogger(context, config)
    const resetPasswordOptions: ResetPasswordOptions = { ...payload, newPassword }
    const resetPasswordResult = await resetPassword(connection, auditLogger, resetPasswordOptions)

    if (isError(resetPasswordResult)) {
      console.error(resetPasswordResult)
      return createRedirectResponse("/500")
    }

    if (resetPasswordResult) {
      return {
        props: {
          token,
          passwordInsecure: true,
          passwordInsecureMessage: resetPasswordResult,
          csrfToken,
          suggestedPassword,
          suggestedPasswordUrl
        }
      }
    }

    return createRedirectResponse("/login/reset-password/success")
  }
  if (suggestPassword === "true") {
    suggestedPassword = generateRandomPassword()
  }

  return {
    props: {
      token,
      csrfToken,
      suggestedPassword,
      suggestedPasswordUrl
    }
  }
})

interface Props {
  token: string
  csrfToken: string
  passwordsMismatch?: boolean
  invalidPassword?: boolean
  invalidToken?: boolean
  passwordInsecure?: boolean
  passwordInsecureMessage?: string
  suggestedPassword: string
  suggestedPasswordUrl: string
}

const ResetPassword = ({
  token,
  csrfToken,
  passwordsMismatch,
  invalidPassword,
  invalidToken,
  passwordInsecure,
  passwordInsecureMessage,
  suggestedPassword,
  suggestedPasswordUrl
}: Props) => {
  const passwordMismatchError = "Passwords do not match"
  const newPasswordMissingError = "Enter a new password"
  const newPasswordError =
    (invalidPassword && newPasswordMissingError) ||
    (passwordsMismatch && passwordMismatchError) ||
    (passwordInsecure && passwordInsecureMessage)
  const errorSummaryTitle = (passwordsMismatch && "Your passwords do not match") || "There is a problem"

  return (
    <>
      <Head>
        <title>{"Reset Password"}</title>
      </Head>
      <Layout>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 data-test="check-email" className="govuk-heading-xl">
              {"Reset Password"}
            </h1>

            <ErrorSummary title={errorSummaryTitle} show={invalidPassword || passwordsMismatch || !!passwordInsecure}>
              <ErrorSummaryList
                items={[
                  { id: "newPassword", error: invalidPassword && newPasswordMissingError },
                  { id: "newPassword", error: passwordsMismatch && "Enter the same password twice" },
                  { id: "newPassword", error: passwordInsecureMessage }
                ]}
              />
            </ErrorSummary>

            {invalidToken && (
              <ErrorSummary title="Unable to verify email address">
                <p>
                  {"This link is either incorrect or may have expired. Please "}
                  <Link href="/login/forgot-password">{"try resetting your password again"}</Link>
                  {" to receive another link."}
                </p>
                <p>
                  {"If you still have an issue with resetting your password you will need to "}
                  <Link href={config.contactUrl}>{"contact us"}</Link>
                  {"."}
                </p>
              </ErrorSummary>
            )}

            {!invalidToken && (
              <Form method="post" csrfToken={csrfToken}>
                <TextInput name="newPassword" label="New password" type="password" error={newPasswordError} />
                <TextInput
                  name="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  error={passwordsMismatch && passwordMismatchError}
                />
                <input type="hidden" id="token" name="token" value={token} />
                <Button noDoubleClick>{"Reset password"}</Button>
                <SuggestPassword suggestedPassword={suggestedPassword} suggestedPasswordUrl={suggestedPasswordUrl} />
              </Form>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default ResetPassword
