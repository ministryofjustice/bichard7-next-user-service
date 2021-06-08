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
import { AdminInitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import crypto from "crypto"

const generateSecretHash = (username: string) =>
  crypto
    .createHmac("SHA256", config.cognitoAuthenticator.clientSecret)
    .update(username + config.cognitoAuthenticator.clientId)
    .digest("base64")

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let invalidCredentials = false
  let token = ""

  if (req.method === "POST") {
    const credentials: UserCredentials = (await parseFormData(req)) as { emailAddress: string; password: string }

    if (credentials.emailAddress && credentials.password) {
      const client = new CognitoIdentityProviderClient({
        credentials: {
          accessKeyId: config.cognitoAuthenticator.accessKeyId,
          secretAccessKey: config.cognitoAuthenticator.secretAccessKey,
          sessionToken: config.cognitoAuthenticator.sessionToken
        },
        region: config.cognitoAuthenticator.region
      })

      const command = new AdminInitiateAuthCommand({
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: {
          USERNAME: credentials.emailAddress,
          PASSWORD: credentials.password,
          SECRET_HASH: generateSecretHash(credentials.emailAddress)
        },
        ClientId: config.cognitoAuthenticator.clientId,
        UserPoolId: config.cognitoAuthenticator.userPoolId
      })

      try {
        const response = await client.send(command)
        console.log(response)
        token = response.AuthenticationResult?.AccessToken || ""
      } catch (error) {
        console.error("Cognito failed", error)
        invalidCredentials = true
      }
    } else {
      invalidCredentials = true
    }
  }

  return {
    props: {
      invalidCredentials,
      token
    }
  }
}

interface Props {
  invalidCredentials?: boolean
  token?: string
}

const Index = ({ invalidCredentials, token }: Props) => (
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

      {token && (
        <GridRow>
          <code style={{ wordWrap: "break-word" }}>{token}</code>
        </GridRow>
      )}
    </Layout>
  </>
)

export default Index
