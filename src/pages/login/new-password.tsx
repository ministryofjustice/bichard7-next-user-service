import Button from "components/Button"
import Form from "components/Form"
import Layout from "components/Layout"
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
import createRedirectResponse from "utils/createRedirectResponse"
import isPost from "utils/isPost"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, query, formData, csrfToken } = context as CsrfServerSidePropsContext
  let errorMessage = ""
  let suggestedPassword = ""
  const { token, suggestPassword } = query as { token: EmailVerificationToken; suggestPassword: string }
  const generatePassword = new URL("/login/new-password", config.baseUrl)
  generatePassword.searchParams.append("token", token)
  generatePassword.searchParams.append("suggestPassword", "true")
  const suggestedPasswordUrl = generatePassword.href

  if (isPost(req)) {
    const { newPassword, confirmPassword } = formData as {
      newPassword: string
      confirmPassword: string
    }

    if (newPassword === "" || confirmPassword === "") {
      errorMessage = "Passwords cannot be empty."
      return {
        props: { errorMessage, csrfToken }
      }
    }

    if (newPassword !== confirmPassword) {
      errorMessage = "Passwords do not match."
      return {
        props: { errorMessage, csrfToken }
      }
    }

    const translatedToken = decodeEmailVerificationToken(token)
    if (isError(translatedToken)) {
      return {
        props: { errorMessage: "This link is either incorrect or may have expired. Please try again.", csrfToken }
      }
    }
    const { emailAddress, verificationCode } = translatedToken

    const connection = getConnection()
    const auditLogger = getAuditLogger(context, config)
    const result = await initialiseUserPassword(connection, auditLogger, emailAddress, verificationCode, newPassword)

    if (!isError(result)) {
      return createRedirectResponse("/login/reset-password/success")
    }

    errorMessage = result.message
  } else if (suggestPassword === "true") {
    suggestedPassword = generateRandomPassword()
  }

  return {
    props: { errorMessage, suggestedPassword, suggestedPasswordUrl, csrfToken }
  }
})

interface Props {
  csrfToken: string
  errorMessage: string
  suggestedPassword?: string
  suggestedPasswordUrl?: string
}

const NewPassword = ({ csrfToken, errorMessage, suggestedPassword, suggestedPasswordUrl }: Props) => {
  return (
    <>
      <Head>
        <title>{"First time password setup"}</title>
      </Head>
      <Layout>
        <div className="govuk-grid-row">
          <h3 data-test="check-email" className="govuk-heading-xl">
            {"First time password setup"}
          </h3>
          <Form method="post" csrfToken={csrfToken}>
            <span id="event-name-error" className="govuk-error-message">
              {errorMessage}
            </span>

            <TextInput id="newPassword" name="newPassword" label="New Password" type="password" width="20" />
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              width="20"
            />

            <Button noDoubleClick>{"Set password"}</Button>
            <SuggestPassword suggestedPassword={suggestedPassword} suggestedPasswordUrl={suggestedPasswordUrl} />
          </Form>
        </div>
      </Layout>
    </>
  )
}

export default NewPassword
