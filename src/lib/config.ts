interface DatabaseAuthenticatorConfig {
  dbHost: string
  dbUser: string
  dbPassword: string
  dbDatabase: string
  dbPort: number
  dbSsl: boolean
}

interface UserServiceConfig {
  bichardRedirectURL: string
  databaseAuthenticator: DatabaseAuthenticatorConfig
  incorrectDelay: number
  tokenExpiresIn: string
  tokenIssuer: string
  tokenQueryParamName: string
  tokenSecret: string
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/Authenticate",
  incorrectDelay: parseInt(process.env.INCORRECT_DELAY ?? "10", 10),
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ?? "5 seconds",
  tokenIssuer: process.env.TOKEN_ISSUER ?? "Bichard",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  tokenSecret: process.env.TOKEN_SECRET ?? "OliverTwist",
  databaseAuthenticator: {
    dbHost: process.env.DB_AUTH_HOST ?? "localhost",
    dbUser: process.env.DB_AUTH_USER ?? "bichard",
    dbPassword: process.env.DB_AUTH_PASSWORD ?? "password",
    dbDatabase: process.env.DB_AUTH_DATABASE ?? "bichard",
    dbPort: parseInt(process.env.DB_AUTH_PORT ?? "5432", 10),
    dbSsl: process.env.DB_AUTH_SSL === "true"
  }
}

export default config
