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
import getRedirectUrl from "lib/getRedirectUrl"
import config from "lib/config"
import { withCsrf } from "middleware"
import isPost from "utils/isPost"
import { ParsedUrlQuery } from "querystring"
import { ErrorSummaryList } from "components/ErrorSummary"

export const getServerSideProps = withCsrf(
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res, formData, csrfToken, query } = context as CsrfServerSidePropsContext
    const emailError = "Email address is not valid"

    if (isPost(req)) {
      const { emailAddress } = formData as { emailAddress: string }

      if (emailAddress) {
        const connection = getConnection()

        const redirectUrl = getRedirectUrl(query, config)
        const sent = await sendVerificationEmail(connection, emailAddress, redirectUrl as string)

        if (isError(sent)) {
          console.error(sent)
          return {
            props: { emailError, csrfToken, emailAddress }
          }
        }

        return createRedirectResponse("/login/check-email")
      }

      return {
        props: { emailError, csrfToken, emailAddress }
      }
    }

    const { notYou } = query as { notYou: string }

    if (notYou === "true") {
      removeEmailAddressCookie(res, config)
    } else {
      const emailAddressFromCookie = getEmailAddressFromCookie(req, config)

      if (emailAddressFromCookie) {
        const connection = getConnection()
        const redirectUrl = getRedirectUrl(query, config)
        const verificationUrl = await generateEmailVerificationUrl(
          connection,
          config,
          emailAddressFromCookie,
          redirectUrl as string
        )

        if (!isError(verificationUrl)) {
          return createRedirectResponse(verificationUrl.href)
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
}

const Index = ({ emailAddress, emailError, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        <ErrorSummary title="Invalid email" show={!!emailError}>
          <ErrorSummaryList
            items={[{ id: "email", error: "Please check you have entered your email address correctly." }]}
          />
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
          <Link href="/login/forgot-password">{"I forgot my password"}</Link>
        </p>
      </GridRow>
    </Layout>
  </>
)

export default Index
