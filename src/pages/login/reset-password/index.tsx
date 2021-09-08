import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
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
import isPost from "utils/isPost"
import getAuditLogger from "lib/getAuditLogger"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  const { token, suggestPassword } = query as { token: string; suggestPassword: string }
  const generatePassword = new URL("/login/reset-password", config.baseUrl)
  generatePassword.searchParams.append("token", token)
  generatePassword.searchParams.append("suggestPassword", "true")
  const suggestedPasswordUrl = generatePassword.href
  const payload = decodePasswordResetToken(token)
  let suggestedPassword = ""

  if (isError(payload)) {
    return {
      props: {
        token,
        invalidToken: true,
        invalidPassword: false,
        passwordMismatch: false,
        passwordInsecure: false,
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
          invalidToken: false,
          invalidPassword: true,
          passwordMismatch: false,
          passwordInsecure: false,
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
          invalidToken: false,
          invalidPassword: false,
          passwordMismatch: true,
          passwordInsecure: false,
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
          invalidToken: false,
          invalidPassword: false,
          passwordMismatch: false,
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
      return createRedirectResponse("/error")
    }

    if (resetPasswordResult) {
      return {
        props: {
          token,
          passwordMismatch: false,
          invalidPassword: false,
          invalidToken: false,
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
      passwordMismatch: false,
      invalidPassword: false,
      invalidToken: false,
      passwordInsecure: false,
      csrfToken,
      suggestedPassword,
      suggestedPasswordUrl
    }
  }
})

interface Props {
  token: string
  csrfToken: string
  passwordMismatch: boolean
  invalidPassword: boolean
  invalidToken: boolean
  passwordInsecure: boolean
  passwordInsecureMessage?: string
  suggestedPassword: string
  suggestedPasswordUrl: string
}

const ResetPassword = ({
  token,
  csrfToken,
  passwordMismatch,
  invalidPassword,
  invalidToken,
  passwordInsecure,
  passwordInsecureMessage,
  suggestedPassword,
  suggestedPasswordUrl
}: Props) => (
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

          {invalidToken && (
            <ErrorSummary title="Unable to verify email address">
              {"This link is either incorrect or may have expired. Please try again."}
            </ErrorSummary>
          )}

          {invalidPassword && (
            <ErrorSummary title="Password field is mandatory">{"Password fields cannot be empty."}</ErrorSummary>
          )}

          {passwordMismatch && (
            <ErrorSummary title="Passwords do not match">{"Provided new passwords do not match."}</ErrorSummary>
          )}

          {passwordInsecure && <ErrorSummary title="Password is insecure">{passwordInsecureMessage}</ErrorSummary>}

          {!invalidToken && (
            <Form method="post" csrfToken={csrfToken}>
              <TextInput
                id="newPassword"
                name="newPassword"
                label="New password"
                type="password"
                isError={invalidPassword || passwordMismatch}
              />
              <TextInput
                id="configmPassword"
                name="confirmPassword"
                label="Confirm new password"
                type="password"
                isError={passwordMismatch}
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

export default ResetPassword
