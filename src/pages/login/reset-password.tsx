import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import BackLink from "components/BackLink"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { withCsrf } from "middleware"
import { isGet, isPost } from "utils/http"
import { ParsedUrlQuery } from "querystring"
import { ErrorSummaryList } from "components/ErrorSummary"
import config from "lib/config"
import { removeCjsmSuffix } from "lib/cjsmSuffix"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"
import Database from "types/Database"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import Link from "components/Link"
import getAuditLogger from "lib/getAuditLogger"
import SuggestPassword from "components/SuggestPassword"
import addQueryParams from "utils/addQueryParams"
import logger from "utils/logger"
import generateRandomPassword from "useCases/generateRandomPassword"
import passwordSecurityCheck from "useCases/passwordSecurityCheck"
import resetPassword, { ResetPasswordOptions } from "useCases/resetPassword"
import SuccessBanner from "components/SuccessBanner"
import NotReceivedEmail from "components/NotReceivedEmail"
import Paragraph from "components/Paragraph"
import GridColumn from "components/GridColumn"

const handleEmailStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress } = formData as { emailAddress: string }

  if (!emailAddress.match(/\S+@\S+\.\S+/)) {
    return {
      props: {
        csrfToken,
        emailAddress,
        emailError: "Enter a valid email address",
        resetStage: "email"
      }
    }
  }

  const normalisedEmail = removeCjsmSuffix(emailAddress)
  const sent = await sendVerificationCodeEmail(connection, normalisedEmail, "passwordReset")

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: { csrfToken, emailAddress: normalisedEmail }
    }
  }
  const suggestedPasswordUrl = addQueryParams("/login/reset-password", {
    email: emailAddress,
    suggestPassword: "true"
  })

  return Promise.resolve({
    props: {
      csrfToken,
      emailAddress: normalisedEmail,
      resetStage: "validateCode",
      validationCode: "",
      suggestedPasswordUrl
    }
  })
}

const handleValidateCodeStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress, validationCode, newPassword, confirmPassword } = formData as {
    emailAddress: string
    validationCode: string
    newPassword: string
    confirmPassword: string
  }
  const suggestedPasswordUrl = addQueryParams("/login/reset-password", {
    email: emailAddress,
    suggestPassword: "true"
  })

  if (!newPassword) {
    return {
      props: {
        emailAddress,
        validationCode,
        invalidPassword: true,
        csrfToken,
        suggestedPassword: "",
        suggestedPasswordUrl,
        resetStage: "validateCode"
      }
    }
  }

  if (newPassword !== confirmPassword) {
    return {
      props: {
        emailAddress,
        validationCode,
        passwordsMismatch: true,
        csrfToken,
        suggestedPassword: "",
        suggestedPasswordUrl,
        resetStage: "validateCode"
      }
    }
  }

  const passwordCheckResult = passwordSecurityCheck(newPassword)
  if (isError(passwordCheckResult)) {
    logger.error(passwordCheckResult.message)
    return {
      props: {
        emailAddress,
        validationCode,
        passwordInsecure: true,
        passwordInsecureMessage: passwordCheckResult.message,
        csrfToken,
        suggestedPassword: "",
        suggestedPasswordUrl,
        resetStage: "validateCode"
      }
    }
  }

  const auditLogger = getAuditLogger(context, config)
  const resetPasswordOptions: ResetPasswordOptions = {
    emailAddress,
    passwordResetCode: validationCode,
    newPassword
  }
  const resetPasswordResult = await resetPassword(connection, auditLogger, resetPasswordOptions)
  if (isError(resetPasswordResult)) {
    logger.error(`Error resetting password: ${resetPasswordResult}`)
    return createRedirectResponse("/500")
  }

  if (resetPasswordResult) {
    return {
      props: {
        emailAddress,
        validationCode,
        passwordInsecure: true,
        passwordInsecureMessage: resetPasswordResult,
        csrfToken,
        suggestedPassword: "",
        suggestedPasswordUrl,
        resetStage: "validateCode"
      }
    }
  }

  return {
    props: {
      csrfToken,
      resetStage: "success"
    }
  }
}

const handlePost = (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
  const { formData } = context as CsrfServerSidePropsContext
  const { resetStage } = formData as { emailAddress: string; resetStage: string }
  const connection = getConnection()

  if (resetStage === "email") {
    return handleEmailStage(context, connection)
  }

  if (resetStage === "validateCode") {
    return handleValidateCodeStage(context, connection)
  }

  return Promise.resolve(createRedirectResponse("/500"))
}

const handleGet = (context: GetServerSidePropsContext<ParsedUrlQuery>): GetServerSidePropsResult<Props> => {
  const { csrfToken, query } = context as CsrfServerSidePropsContext
  const { email, suggestPassword } = query as { email: string; suggestPassword: string }
  let suggestedPassword = ""

  const suggestedPasswordUrl = addQueryParams("/login/reset-password", {
    email,
    suggestPassword: "true"
  })

  if (suggestPassword === "true") {
    suggestedPassword = generateRandomPassword()
  }

  if (email) {
    return {
      props: {
        csrfToken,
        emailAddress: email,
        resetStage: "validateCode",
        validationCode: "",
        suggestedPassword,
        suggestedPasswordUrl
      }
    }
  }
  return {
    props: {
      csrfToken,
      resetStage: "email"
    }
  }
}

export const getServerSideProps = withCsrf(
  (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context as CsrfServerSidePropsContext

    if (isPost(req)) {
      return handlePost(context)
    }

    if (isGet(req)) {
      return Promise.resolve(handleGet(context))
    }

    return Promise.resolve(createRedirectResponse("/400"))
  }
)

interface Props {
  emailError?: string
  csrfToken: string
  resetStage?: string
  emailAddress?: string
  validationCode?: string
  passwordsMismatch?: boolean
  invalidPassword?: boolean
  passwordInsecure?: boolean
  passwordInsecureMessage?: string
  suggestedPassword?: string
  suggestedPasswordUrl?: string
}

const ForgotPassword = ({
  emailError,
  csrfToken,
  resetStage,
  emailAddress,
  validationCode,
  passwordsMismatch,
  invalidPassword,
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
        <title>{"Reset password"}</title>
      </Head>
      <Layout>
        {resetStage === "success" ? (
          <GridRow>
            <GridColumn width="two-thirds">
              <BackLink href="/" />

              <SuccessBanner>
                {`You can now `}
                <Link href="/">{`sign in with your new password`}</Link>
                {`.`}
              </SuccessBanner>
            </GridColumn>
          </GridRow>
        ) : (
          <GridRow>
            <GridColumn width="two-thirds">
              <BackLink href="/" />

              <h1 className="govuk-heading-xl">{"Reset password"}</h1>

              <ErrorSummary title={errorSummaryTitle} show={invalidPassword || passwordsMismatch || !!passwordInsecure}>
                <ErrorSummaryList
                  items={[
                    { id: "newPassword", error: invalidPassword && newPasswordMissingError },
                    { id: "newPassword", error: passwordsMismatch && "Enter the same password twice" },
                    { id: "newPassword", error: passwordInsecureMessage }
                  ]}
                />
              </ErrorSummary>

              <ErrorSummary title="There is a problem" show={!!emailError}>
                <ErrorSummaryList
                  items={[{ id: "email", error: "Please check you have entered your email address correctly." }]}
                />
              </ErrorSummary>

              {resetStage === "email" && (
                <Form method="post" csrfToken={csrfToken}>
                  <Paragraph>{"We will email you a code to reset your password."}</Paragraph>
                  <TextInput id="email" name="emailAddress" label="Email address" type="email" error={emailError} />
                  <input type="hidden" name="resetStage" value="email" />
                  <Button noDoubleClick>{"Send the code"}</Button>
                </Form>
              )}

              {resetStage === "validateCode" && (
                <Form method="post" csrfToken={csrfToken}>
                  <Paragraph>{"If an account was found we will have sent you an email."}</Paragraph>
                  <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
                  <input type="hidden" name="resetStage" value="validateCode" />
                  <NotReceivedEmail sendAgainUrl="/login/reset-password" />
                  <TextInput
                    id="validationCode"
                    name="validationCode"
                    label="Enter the 6 character code from the email"
                    type="text"
                    value={validationCode}
                  />
                  <TextInput name="newPassword" label="New password" type="password" error={newPasswordError} />
                  <TextInput
                    name="confirmPassword"
                    label="Confirm new password"
                    type="password"
                    error={passwordsMismatch && passwordMismatchError}
                  />
                  <Button noDoubleClick>{"Reset password"}</Button>
                  <SuggestPassword suggestedPassword={suggestedPassword} suggestedPasswordUrl={suggestedPasswordUrl} />
                </Form>
              )}
            </GridColumn>
          </GridRow>
        )}
      </Layout>
    </>
  )
}

export default ForgotPassword
