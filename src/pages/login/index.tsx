import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import {
  generateEmailVerificationUrl,
  getEmailAddressFromCookie,
  removeEmailAddressCookie,
  sendVerificationEmail
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
import { removeCjsmSuffix } from "lib/cjsmSuffix"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res, formData, csrfToken, query, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    if (currentUser) {
      return createRedirectResponse("/")
    }

    const baseUrl = req.headers["x-origin"] || req.headers.origin || config.baseUrl

    if (!baseUrl || Array.isArray(baseUrl)) {
      console.error("baseUrl is invalid", baseUrl)
      return createRedirectResponse("/500")
    }

    if (isPost(req)) {
      const { emailAddress } = formData as { emailAddress: string }

      if (!emailAddress.match(/\S+@\S+\.\S+/)) {
        return {
          props: {
            csrfToken,
            emailAddress,
            emailError: "Enter a valid email address"
          }
        }
      }

      const normalisedEmail = removeCjsmSuffix(emailAddress)
      const sent = await sendVerificationEmail(getConnection(), normalisedEmail, baseUrl, getRedirectPath(query))

      if (isError(sent)) {
        console.error(sent)
        return {
          props: { csrfToken, emailAddress, sendingError: true }
        }
      }

      return createRedirectResponse("/login/check-email")
    }

    const { notYou } = query as { notYou: string }

    if (notYou === "true") {
      removeEmailAddressCookie(res, config)
    } else {
      const emailAddressFromCookie = getEmailAddressFromCookie(req, config)

      if (emailAddressFromCookie) {
        const connection = getConnection()
        const redirectPath = getRedirectPath(query)
        const verificationUrl = await generateEmailVerificationUrl(
          connection,
          config,
          emailAddressFromCookie,
          baseUrl,
          redirectPath
        )

        if (!isError(verificationUrl) && typeof verificationUrl !== "undefined") {
          const redirect = `${verificationUrl.pathname}${verificationUrl.search}`
          return createRedirectResponse(redirect, { basePath: false })
        }
      }
    }

    return {
      props: { csrfToken }
    }
  }
)

interface Props {
  emailAddress?: string
  emailError?: string
  csrfToken: string
  sendingError?: boolean
}

const Index = ({ emailAddress, emailError, csrfToken, sendingError }: Props) => (
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

        <Form method="post" csrfToken={csrfToken}>
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
