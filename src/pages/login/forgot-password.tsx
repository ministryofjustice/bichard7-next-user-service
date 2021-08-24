import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsResult } from "next"
import BackLink from "components/BackLink"
import ErrorSummary from "components/ErrorSummary"
import getConnection from "lib/getConnection"
import { sendPasswordResetEmail } from "useCases"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { withCsrf } from "middleware"

export const getServerSideProps = withCsrf(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken } = context as CsrfServerSidePropsContext
  if (req.method === "POST") {
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
      return createRedirectResponse("/error")
    }

    return createRedirectResponse("/login/reset-password/check-email")
  }

  return {
    props: {
      invalidEmail: false,
      csrfToken
    }
  }
})

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

        <Form method="post" csrfToken={csrfToken}>
          <TextInput id="email" name="emailAddress" label="Email address" type="email" isError={invalidEmail} />
          <Button noDoubleClick>{"Continue"}</Button>
        </Form>
      </GridRow>
    </Layout>
  </>
)

export default ForgotPassword
