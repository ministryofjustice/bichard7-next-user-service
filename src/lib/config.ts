interface LocalAuthenticatorConfig {
  jwtIssuer: string
  jwtSecret: string
  jwtExpiresIn: string
}

interface UserServiceConfig {
  bichardRedirectURL: string
  localAuthenticator: LocalAuthenticatorConfig
  tokenQueryParamName: string
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/Authenticate",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  localAuthenticator: {
    jwtIssuer: process.env.LOCAL_AUTH_TOKEN_ISSUER || "Bichard",
    jwtSecret: process.env.LOCAL_AUTH_TOKEN_SECRET || "OliverTwist",
    jwtExpiresIn: process.env.LOCAL_AUTH_TOKEN_EXPIRES_IN || "5 seconds"
  }
}

export default config
