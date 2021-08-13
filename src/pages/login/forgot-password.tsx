import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps, GetServerSidePropsResult } from "next"
import BackLink from "components/BackLink"
import parseFormData from "lib/parseFormData"
import ErrorSummary from "components/ErrorSummary"
import getConnection from "lib/getConnection"
import { sendPasswordResetEmail } from "useCases"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"

export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<GetServerSidePropsResult<Props>> => {
  if (req.method === "POST") {
    const { emailAddress } = (await parseFormData(req)) as { emailAddress: string }

    if (!emailAddress) {
      return {
        props: {
          invalidEmail: true
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
      invalidEmail: false
    }
  }
}

interface Props {
  invalidEmail: boolean
}

const ForgotPassword = ({ invalidEmail }: Props) => (
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

        <form method="post">
          <TextInput id="email" name="emailAddress" label="Email address" type="email" isError={invalidEmail} />
          <Button>{"Continue"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default ForgotPassword
