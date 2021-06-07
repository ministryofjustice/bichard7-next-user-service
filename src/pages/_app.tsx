import Amplify from "@aws-amplify/core"
import Auth from "@aws-amplify/auth"
import { AppProps } from "next/app"
import { useEffect } from "react"
import "../styles/globals.scss"

Amplify.configure({
  Auth: {
    // Amazon Cognito Region
    region: process.env.COGNITO_REGION,

    // Amazon Cognito User Pool ID
    userPoolId: process.env.COGNITO_USER_POOL_ID,

    // Amazon Cognito Web Client ID
    userPoolWebClientId: process.env.COGNITO_CLIENT_ID,

    // The authentication flow type
    authenticationFlowType: "CUSTOM_AUTH"
  }
})

Auth.configure()

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    document.body.className = document.body.className ? `${document.body.className} js-enabled` : "js-enabled"

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const GovUkFrontend = require("govuk-frontend")
    GovUkFrontend.initAll()
  }, [])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default App
