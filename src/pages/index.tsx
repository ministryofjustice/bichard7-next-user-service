import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import { UserCredentials } from "lib/User"
import config from "lib/config"
import { authenticate } from "useCases"
import getConnection from "lib/getConnection"
import getSignedToken from "lib/getSignedToken"
import isError from "lib/isError"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.method === "POST") {
    const credentials: UserCredentials = (await parseFormData(req)) as { emailAddress: string; password: string }

    if (credentials.emailAddress && credentials.password) {
      const connection = getConnection()

      const user = await authenticate(credentials, connection)

      if (isError(user)) {
        console.error(user)
        return {
          props: {
            invalidCredentials: true
          }
        }
      }

      const token = getSignedToken(user)

      if (isError(token)) {
        console.error(token)
        return {
          props: {
            invalidCredentials: true
          }
        }
      }

      if (user && token) {
        const url = new URL(config.bichardRedirectURL)
        url.searchParams.append(config.tokenQueryParamName, token)

        return {
          redirect: {
            destination: url.href,
            statusCode: 302
          }
        }
      }
      return {
        props: {
          invalidCredentials: true
        }
      }
    }
    return {
      props: {
        invalidCredentials: false
      }
    }
  }
  return {
    props: {
      invalidCredentials: false
    }
  }
}

interface Props {
  invalidCredentials?: boolean
}

const Index = ({ invalidCredentials }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {invalidCredentials && (
          <ErrorSummary title="Invalid credentials">
            {"The supplied email address and password are not valid."}
          </ErrorSummary>
        )}

        <form action="/" method="post">
          <TextInput id="email" name="emailAddress" label="Email address" type="email" />
          <TextInput id="password" name="password" label="Password" type="password" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Index
