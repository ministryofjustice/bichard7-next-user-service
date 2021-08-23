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
import { withCsrf } from "middleware"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  const { token } = query as { token: string }
  const payload = decodePasswordResetToken(token)

  if (isError(payload)) {
    return {
      props: {
        token,
        invalidToken: true,
        invalidPassword: false,
        passwordMismatch: false,
        csrfToken
      }
    }
  }

  if (req.method === "POST") {
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
          csrfToken
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
          csrfToken
        }
      }
    }

    const connection = getConnection()
    const resetPasswordOptions: ResetPasswordOptions = { ...payload, newPassword }
    const resetPasswordResult = await resetPassword(connection, resetPasswordOptions)

    if (isError(resetPasswordResult)) {
      return createRedirectResponse("/error")
    }

    return createRedirectResponse("/login/reset-password/success")
  }

  return {
    props: {
      token,
      passwordMismatch: false,
      invalidPassword: false,
      invalidToken: false,
      csrfToken
    }
  }
})

interface Props {
  token: string
  csrfToken: string
  passwordMismatch: boolean
  invalidPassword: boolean
  invalidToken: boolean
}

const ResetPassword = ({ token, csrfToken, passwordMismatch, invalidPassword, invalidToken }: Props) => (
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
            </Form>
          )}
        </div>
      </div>
    </Layout>
  </>
)

export default ResetPassword
