import DatabaseConfig from "./DatabaseConfig"

interface UserServiceConfig {
  bichardRedirectURL: string
  database: DatabaseConfig
  emailVerificationExpiresIn: number
  incorrectDelay: number
  tokenExpiresIn: string
  tokenIssuer: string
  tokenQueryParamName: string
  tokenSecret: string
  verificationCodeLength: number
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/Authenticate",
  emailVerificationExpiresIn: parseInt(process.env.EMAIL_VERIFICATION_EXPIRY ?? "30", 10),
  incorrectDelay: parseInt(process.env.INCORRECT_DELAY ?? "10", 10),
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ?? "5 seconds",
  tokenIssuer: process.env.TOKEN_ISSUER ?? "Bichard",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  tokenSecret: process.env.TOKEN_SECRET ?? "OliverTwist",
  database: {
    host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
    user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
    password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
    database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
    port: parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
    ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true"
  },
  verificationCodeLength: 6
}

export default config
