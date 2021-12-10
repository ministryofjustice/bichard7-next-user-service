import Button from "components/Button"
import { ErrorSummary, ErrorSummaryList } from "components/ErrorSummary"
import Form from "components/Form"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import SuggestPassword from "components/SuggestPassword"
import TextInput from "components/TextInput"
import config from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import getConnection from "lib/getConnection"
import { decodeEmailVerificationToken, EmailVerificationToken } from "lib/token/emailVerificationToken"
import { withCsrf } from "middleware"
import { GetServerSidePropsResult } from "next"
import Head from "next/head"
import React from "react"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { isError } from "types/Result"
import generateRandomPassword from "useCases/generateRandomPassword"
import initialiseUserPassword from "useCases/initialiseUserPassword"
import addQueryParams from "utils/addQueryParams"
import createRedirectResponse from "utils/createRedirectResponse"
import { isPost } from "utils/http"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  let suggestedPassword = ""
  const { token, suggestPassword } = query as { token: EmailVerificationToken; suggestPassword: string }

  const translatedToken = decodeEmailVerificationToken(token)
  if (isError(translatedToken)) {
    return {
      props: {
        invalidToken: true,
        csrfToken
      }
    }
  }

  const suggestedPasswordUrl = addQueryParams("/login/new-password", {
    token,
    suggestPassword: "true"
  })

  if (isPost(req)) {
    const { newPassword, confirmPassword } = formData as {
      newPassword: string
      confirmPassword: string
    }

    if (newPassword === "") {
      return {
        props: { csrfToken, newPasswordMissing: true }
      }
    }

    if (newPassword !== confirmPassword) {
      return {
        props: { csrfToken, passwordsMismatch: true }
      }
    }

    const { emailAddress, verificationCode } = translatedToken

    const connection = getConnection()
    const auditLogger = getAuditLogger(context, config)
    const result = await initialiseUserPassword(connection, auditLogger, emailAddress, verificationCode, newPassword)

    if (!isError(result)) {
      return createRedirectResponse("/login/reset-password/success")
    }

    return {
      props: { csrfToken, errorMessage: result.message }
    }
  }

  if (suggestPassword === "true") {
    suggestedPassword = generateRandomPassword()
  }

  return {
    props: { suggestedPassword, suggestedPasswordUrl, csrfToken }
  }
})

interface Props {
  csrfToken: string
  invalidToken?: boolean
  newPasswordMissing?: boolean
  passwordsMismatch?: boolean
  errorMessage?: string
  suggestedPassword?: string
  suggestedPasswordUrl?: string
}

const NewPassword = ({
  csrfToken,
  invalidToken,
  newPasswordMissing,
  passwordsMismatch,
  errorMessage,
  suggestedPassword,
  suggestedPasswordUrl
}: Props) => {
  const passwordMismatchError = "Passwords do not match"
  const newPasswordMissingError = "New password is mandatory"
  const newPasswordError =
    (newPasswordMissing && newPasswordMissingError) || (passwordsMismatch && passwordMismatchError) || errorMessage

  return (
    <>
      <Head>
        <title>{"First time password setup"}</title>
      </Head>
      <Layout>
        <GridRow>
          <h3 data-test="check-email" className="govuk-heading-xl">
            {"First time password setup"}
          </h3>
          {invalidToken && (
            <ErrorSummary title="Unable to verify email address">
              <p>
                {"This link is either incorrect or may have expired. Please try again by "}
                <Link href="/login">{"resetting your password"}</Link>
                {"."}
              </p>
              <p>
                {"If you still have an issue with setting up your account you will need to "}
                <Link href={config.contactUrl}>{"contact us"}</Link>
                {"."}
              </p>
            </ErrorSummary>
          )}

          <ErrorSummary title="There is a problem" show={!!errorMessage || !!passwordsMismatch || !!newPasswordMissing}>
            <ErrorSummaryList
              items={[
                { id: "newPassword", error: passwordsMismatch && "Passwords do not match." },
                { id: "newPassword", error: newPasswordMissing && "Password field is mandatory." },
                { id: "newPassword", error: errorMessage }
              ]}
            />
          </ErrorSummary>

          {!invalidToken && (
            <Form method="post" csrfToken={csrfToken}>
              <TextInput name="newPassword" label="New Password" type="password" width="20" error={newPasswordError} />
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                width="20"
                error={passwordsMismatch && passwordMismatchError}
              />

              <Button noDoubleClick>{"Set password"}</Button>
              <SuggestPassword suggestedPassword={suggestedPassword} suggestedPasswordUrl={suggestedPasswordUrl} />
            </Form>
          )}
        </GridRow>
      </Layout>
    </>
  )
}

export default NewPassword
