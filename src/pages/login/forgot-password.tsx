import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import BackLink from "components/BackLink"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import getConnection from "lib/getConnection"
import { sendPasswordResetEmail } from "useCases"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { withCsrf } from "middleware"
import isPost from "utils/isPost"
import { ParsedUrlQuery } from "querystring"
import { ErrorSummaryList } from "components/ErrorSummary"
import Link from "components/Link"

export const getServerSideProps = withCsrf(
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken } = context as CsrfServerSidePropsContext

    if (isPost(req)) {
      const { emailAddress } = formData as { emailAddress: string }

      if (!emailAddress) {
        return {
          props: {
            emailError: "Enter a valid email address",
            csrfToken
          }
        }
      }

      const connection = getConnection()
      const result = await sendPasswordResetEmail(connection, emailAddress)

      if (isError(result)) {
        return createRedirectResponse("/500")
      }

      return createRedirectResponse("/login/reset-password/check-email")
    }

    return {
      props: {
        csrfToken
      }
    }
  }
)

interface Props {
  emailError?: string
  csrfToken: string
}

const ForgotPassword = ({ emailError, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"Forgot password"}</title>
    </Head>
    <Layout>
      <GridRow>
        <BackLink href="/" />

        <h1 className="govuk-heading-xl">{"Forgot password"}</h1>

        <ErrorSummary title="There is a problem" show={!!emailError}>
          <ErrorSummaryList
            items={[{ id: "email", error: "Please check you have entered your email address correctly." }]}
          />
        </ErrorSummary>

        <p className="govuk-body">
          <p>
            {"We will email you a link via "}
            <Link href="https://www.cjsm.net/">{"CJSM"}</Link>
            {" to reset your password."}
          </p>

          <Form method="post" csrfToken={csrfToken}>
            <TextInput id="email" name="emailAddress" label="Email address" type="email" error={emailError} />
            <Button noDoubleClick>{"Send the link"}</Button>
          </Form>
        </p>
      </GridRow>
    </Layout>
  </>
)

export default ForgotPassword
