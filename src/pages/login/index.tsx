import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
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

export const getServerSideProps = withCsrf(
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res, formData, csrfToken, query } = context as CsrfServerSidePropsContext
    let invalidEmail = false

    if (isPost(req)) {
      const { emailAddress } = formData as { emailAddress: string }

      if (emailAddress) {
        const connection = getConnection()

        const redirectUrl = getRedirectUrl(query, config)
        const sent = await sendVerificationEmail(connection, emailAddress, redirectUrl as string)

        if (isError(sent)) {
          console.error(sent)
          return {
            props: { invalidEmail: true, csrfToken }
          }
        }

        return createRedirectResponse("/login/check-email")
      }

      invalidEmail = true
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
      props: { invalidEmail, csrfToken }
    }
  }
)

interface Props {
  invalidEmail?: boolean
  csrfToken: string
}

const Index = ({ invalidEmail, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {invalidEmail && (
          <ErrorSummary title="Invalid email">
            {"Please check you have entered your email address correctly."}
          </ErrorSummary>
        )}

        <Form method="post" csrfToken={csrfToken}>
          <TextInput id="email" name="emailAddress" label="Email address" type="email" />
          <Button>{"Sign in"}</Button>
        </Form>
        <p>
          <Link href="/login/forgot-password" data-test="forgot-password">
            {"I forgot my password"}
          </Link>
        </p>
      </GridRow>
    </Layout>
  </>
)

export default Index
