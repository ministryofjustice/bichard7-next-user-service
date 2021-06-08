interface LocalAuthenticatorConfig {
  jwtIssuer: string
  jwtSecret: string
  jwtExpiresIn: string
}

interface CognitoAuthenticatorConfig {
  clientId: string
  clientSecret: string
  region: string
  userPoolId: string
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
}

interface UserServiceConfig {
  bichardRedirectURL: string
  cognitoAuthenticator: CognitoAuthenticatorConfig
  localAuthenticator: LocalAuthenticatorConfig
  tokenQueryParamName: string
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/Authenticate",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  localAuthenticator: {
    jwtIssuer: process.env.LOCAL_AUTH_TOKEN_ISSUER ?? "Bichard",
    jwtSecret: process.env.LOCAL_AUTH_TOKEN_SECRET ?? "OliverTwist",
    jwtExpiresIn: process.env.LOCAL_AUTH_TOKEN_EXPIRES_IN ?? "5 seconds"
  },
  cognitoAuthenticator: {
    clientId: process.env.COGNITO_CLIENT_ID ?? "",
    clientSecret: process.env.COGNITO_CLIENT_SECRET ?? "",
    region: process.env.COGNITO_REGION || "eu-west-2",
    userPoolId: process.env.COGNITO_USER_POOL_ID ?? "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    sessionToken: process.env.AWS_SESSION_TOKEN ?? ""
  }
}

export default config
