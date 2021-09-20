import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import BackLink from "components/BackLink"
import ErrorSummary from "components/ErrorSummary"
import getConnection from "lib/getConnection"
import { sendPasswordResetEmail } from "useCases"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { withCsrf } from "middleware"
import isPost from "utils/isPost"
import { ParsedUrlQuery } from "querystring"

export const getServerSideProps = withCsrf(
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken } = context as CsrfServerSidePropsContext

    if (isPost(req)) {
      const { emailAddress } = formData as { emailAddress: string }

      if (!emailAddress) {
        return {
          props: {
            invalidEmail: true,
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
        invalidEmail: false,
        csrfToken
      }
    }
  }
)

interface Props {
  invalidEmail: boolean
  csrfToken: string
}

const ForgotPassword = ({ invalidEmail, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"Forgot password"}</title>
    </Head>
    <Layout>
      <GridRow>
        <BackLink href="/" />

        <h1 className="govuk-heading-xl">{"Forgot password"}</h1>

        {invalidEmail && (
          <ErrorSummary title="Invalid email">{"The supplied email address is not valid."}</ErrorSummary>
        )}

        <p className="govuk-body">
          <p>{"We will email you a link to reset your password."}</p>

          <Form method="post" csrfToken={csrfToken}>
            <TextInput id="email" name="emailAddress" label="Email address" type="email" isError={invalidEmail} />
            <Button noDoubleClick>{"Send the link"}</Button>
          </Form>
        </p>
      </GridRow>
    </Layout>
  </>
)

export default ForgotPassword
