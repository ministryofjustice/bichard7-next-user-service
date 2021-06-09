import Button from "components/Button"
import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSideProps } from "next"
import parseFormData from "lib/parseFormData"
import config from "lib/config"
import {
  AdminRespondToAuthChallengeCommand,
  CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider"
import crypto from "crypto"
import Cookies from "cookies"

const generateSecretHash = (username: string) =>
  crypto
    .createHmac("SHA256", config.cognitoAuthenticator.clientSecret)
    .update(username + config.cognitoAuthenticator.clientId)
    .digest("base64")

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let invalidCode = false

  if (req.method === "POST") {
    const { code } = (await parseFormData(req)) as { code: string }

    if (code) {
      const cookies = new Cookies(req, res)
      const cookie = JSON.parse(cookies.get("cognito-login")!)

      const client = new CognitoIdentityProviderClient({
        credentials: {
          accessKeyId: config.cognitoAuthenticator.accessKeyId,
          secretAccessKey: config.cognitoAuthenticator.secretAccessKey,
          sessionToken: config.cognitoAuthenticator.sessionToken
        },
        region: config.cognitoAuthenticator.region
      })

      const command = new AdminRespondToAuthChallengeCommand({
        ChallengeName: "CUSTOM_CHALLENGE",
        ChallengeResponses: {
          USERNAME: cookie.USERNAME,
          ANSWER: code,
          SECRET_HASH: generateSecretHash(cookie.USERNAME)
        },
        ClientId: config.cognitoAuthenticator.clientId,
        Session: cookie.session,
        UserPoolId: config.cognitoAuthenticator.userPoolId
      })

      try {
        const response = await client.send(command)
        const token = response.AuthenticationResult?.IdToken

        if (token) {
          return {
            redirect: {
              destination: `/authed?token=${token}`,
              statusCode: 302
            }
          }
        }
        console.log(response)
        console.error("No token in response")
        invalidCode = true
      } catch (error) {
        console.error("Cognito failed", error)
        invalidCode = true
      }
    } else {
      invalidCode = true
    }
  }

  return {
    props: {
      invalidCode
    }
  }
}

interface Props {
  invalidCode?: boolean
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
          <ErrorSummary title="Invalid credentials">{"The supplied confirmation code is not valid."}</ErrorSummary>
        )}

        <form action="/verify" method="post">
          <TextInput id="code" name="code" label="Confirmation code" type="number" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Verify
