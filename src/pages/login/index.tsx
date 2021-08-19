import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsResult } from "next"
import { sendVerificationEmail } from "useCases"
import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import Link from "components/Link"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import { useCsrfServerSideProps } from "hooks"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"

export const getServerSideProps = useCsrfServerSideProps(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken } = context as CsrfServerSidePropsContext
  let invalidEmail = false

  if (req.method === "POST") {
    const { emailAddress } = formData as { emailAddress: string }

    if (emailAddress) {
      const connection = getConnection()
      const sent = await sendVerificationEmail(connection, emailAddress)

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

  return {
    props: { invalidEmail, csrfToken }
  }
})

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
          <ErrorSummary title="Invalid email">{"The supplied email address is not valid."}</ErrorSummary>
        )}

        <Form method="post" csrfToken={csrfToken}>
          <TextInput id="email" name="emailAddress" label="Email address" type="email" />
          <p>
            <Link href="/login/forgot-password">{"Forgot your password?"}</Link>
          </p>
          <Button>{"Sign in"}</Button>
        </Form>
      </GridRow>
    </Layout>
  </>
)

export default Index
