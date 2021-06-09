import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import config from "lib/config"
import { AdminInitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import crypto from "crypto"
import Cookies from "cookies"

const generateSecretHash = (username: string) =>
  crypto
    .createHmac("SHA256", config.cognitoAuthenticator.clientSecret)
    .update(username + config.cognitoAuthenticator.clientId)
    .digest("base64")

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let invalidCredentials = false

  if (req.method === "POST") {
    const { emailAddress } = (await parseFormData(req)) as { emailAddress: string }

    if (emailAddress) {
      const client = new CognitoIdentityProviderClient({
        credentials: {
          accessKeyId: config.cognitoAuthenticator.accessKeyId,
          secretAccessKey: config.cognitoAuthenticator.secretAccessKey,
          sessionToken: config.cognitoAuthenticator.sessionToken
        },
        region: config.cognitoAuthenticator.region
      })

      const command = new AdminInitiateAuthCommand({
        AuthFlow: "CUSTOM_AUTH",
        AuthParameters: {
          USERNAME: emailAddress,
          SECRET_HASH: generateSecretHash(emailAddress)
        },
        ClientId: config.cognitoAuthenticator.clientId,
        UserPoolId: config.cognitoAuthenticator.userPoolId
      })

      try {
        const response = await client.send(command)
        const challengeParams = response.ChallengeParameters
        const session = response.Session

        const cookies = new Cookies(req, res)
        cookies.set(
          "cognito-login",
          JSON.stringify({
            ...challengeParams,
            session
          })
        )

        return {
          redirect: {
            destination: "/verify",
            statusCode: 302
          }
        }
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
      invalidCredentials
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
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Index
