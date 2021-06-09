import ErrorSummary from "components/ErrorSummary"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import { GetServerSideProps } from "next"
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  let invalidCode = false
  const { code } = query as { code: string }

  const cookies = new Cookies(req, res)
  const cookie = JSON.parse(cookies.get("cognito-login")!)
  const emailAddress = cookie.email

  if (code && emailAddress) {
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
  }

  return {
    props: {
      emailAddress,
      invalidCode
    }
  }
}

interface Props {
  emailAddress: string
  invalidCode?: boolean
}

const Verify = ({ emailAddress, invalidCode }: Props) => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>

    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

        {!invalidCode && (
          <div className="govuk-body">
            <p>
              {"An email has been sent to "}
              <b>{emailAddress}</b>
              {". Please click on the link in the email to continue."}
            </p>
          </div>
        )}

        {invalidCode && (
          <ErrorSummary title="Verification failed">{"There was a problem verifying your email address."}</ErrorSummary>
        )}
      </GridRow>
    </Layout>
  </>
)

export default Verify
