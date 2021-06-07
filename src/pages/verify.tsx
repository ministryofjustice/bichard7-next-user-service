import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import Auth from "@aws-amplify/auth"

interface Props {
  invalidCode?: boolean
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const props: Props = {}

  if (req.method === "POST") {
    const { verifyCode } = (await parseFormData(req)) as { verifyCode: string }

    if (verifyCode) {
      try {
        const user = await Auth.currentAuthenticatedUser()
        await Auth.sendCustomChallengeAnswer(user, verifyCode)

        try {
          await Auth.currentSession()

          return {
            redirect: {
              destination: "/token",
              statusCode: 302
            }
          }
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }

    props.invalidCode = true
  }

  return { props }
}

const Verify = ({ invalidCode }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {invalidCode && (
          <ErrorSummary title="Invalid code">{"The supplied email confirmation code is incorrect"}</ErrorSummary>
        )}

        <form action="/" method="post">
          <TextInput id="verifyCode" name="verifyCode" label="Confirmation code" type="number" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Verify
