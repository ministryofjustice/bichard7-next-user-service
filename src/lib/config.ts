interface LocalAuthenticatorConfig {
  jwtIssuer: string
  jwtSecret: string
  jwtExpiresIn: string
}

interface DatabaseAuthenticatorConfig {
  dbHost: string
  dbUser: string
  dbPassword: string
  dbDatabase: string
  dbPort: number
}

interface UserServiceConfig {
  authenticator: "DB" | "LOCAL"
  bichardRedirectURL: string
  databaseAuthenticator: DatabaseAuthenticatorConfig
  localAuthenticator: LocalAuthenticatorConfig
  tokenQueryParamName: string
}

const config: UserServiceConfig = {
  authenticator: process.env.DB_AUTH ? "DB" : "LOCAL",
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/Authenticate",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  databaseAuthenticator: {
    dbHost: process.env.DB_AUTH_HOST ?? "localhost",
    dbUser: process.env.DB_AUTH_USER ?? "bichard",
    dbPassword: process.env.DB_AUTH_PASSWORD ?? "password",
    dbDatabase: process.env.DB_AUTH_DATABASE ?? "bichard",
    dbPort: Number(process.env.DB_AUTH_PORT) ?? 5432
  },
  localAuthenticator: {
    jwtIssuer: process.env.LOCAL_AUTH_TOKEN_ISSUER ?? "Bichard",
    jwtSecret: process.env.LOCAL_AUTH_TOKEN_SECRET ?? "OliverTwist",
    jwtExpiresIn: process.env.LOCAL_AUTH_TOKEN_EXPIRES_IN ?? "5 seconds"
  }
}

export default config
