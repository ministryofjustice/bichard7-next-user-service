import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import { GetServerSideProps, GetServerSidePropsResult } from "next"
import parseFormData from "lib/parseFormData"
import { decodePasswordResetToken } from "lib/token/passwordResetToken"
import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import resetPassword, { ResetPasswordOptions } from "useCases/resetPassword"
import SuggestPassword from "components/SuggestPassword"
import generateRandomPassword from "useCases/generateRandomPassword"

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query
}): Promise<GetServerSidePropsResult<Props>> => {
  const { token, suggestPassword } = query as { token: string; suggestPassword: string }
  const generatePassword = new URL("/login/reset-password", "http://localhost:3000")
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
        suggestedPassword,
        suggestedPasswordUrl
      }
    }
  }

  if (req.method === "POST") {
    const { newPassword, confirmPassword } = (await parseFormData(req)) as {
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
          suggestedPassword,
          suggestedPasswordUrl
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
  if (suggestPassword === "true") {
    suggestedPassword = generateRandomPassword()
  }

  return {
    props: {
      token,
      passwordMismatch: false,
      invalidPassword: false,
      invalidToken: false,
      suggestedPassword,
      suggestedPasswordUrl
    }
  }
}

interface Props {
  token: string
  passwordMismatch: boolean
  invalidPassword: boolean
  invalidToken: boolean
  suggestedPassword: string
  suggestedPasswordUrl: string
}

const ResetPassword = ({
  token,
  passwordMismatch,
  invalidPassword,
  invalidToken,
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

          {!invalidToken && (
            <form method="post">
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
            </form>
          )}
        </div>
      </div>
    </Layout>
  </>
)

export default ResetPassword
