import CsrfConfig from "types/CsrfConfig"
import DatabaseConfig from "./DatabaseConfig"

interface SmtpConfig {
  host: string
  user: string
  password: string
  port: number
  tls: boolean
}

export interface UserServiceConfig {
  bichardRedirectURL: string
  redirectAccessList: string
  database: DatabaseConfig
  emailFrom: string
  emailVerificationExpiresIn: number
  incorrectDelay: number
  smtp: SmtpConfig
  tokenExpiresIn: string
  tokenIssuer: string
  tokenQueryParamName: string
  tokenSecret: string
  authenticationCookieName: string
  verificationCodeLength: number
  csrf: CsrfConfig
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/Authenticate",
  redirectAccessList: process.env.BICHARD_REDIRECT_ACCESS_LIST ?? "localhost,",
  emailFrom: `Bichard <${process.env.EMAIL_FROM ?? "bichard@cjse.org"}>`,
  emailVerificationExpiresIn: parseInt(process.env.EMAIL_VERIFICATION_EXPIRY ?? "30", 10),
  incorrectDelay: parseInt(process.env.INCORRECT_DELAY ?? "10", 10),
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ?? "15 seconds",
  tokenIssuer: process.env.TOKEN_ISSUER ?? "Bichard",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  tokenSecret: process.env.TOKEN_SECRET ?? "OliverTwist",
  authenticationCookieName: process.env.AUTH_COOKIE_NAME ?? ".AUTH",
  verificationCodeLength: 6,
  csrf: {
    tokenName: process.env.CSRF_COOKIE_NAME ?? "XSRF-TOKEN",
    cookieSecret: process.env.CSRF_TOKEN_SECRET ?? "OliverTwist1",
    formSecret: process.env.CSRF_TOKEN_SECRET ?? "OliverTwist2",
    maximumTokenAgeInSeconds: parseInt(process.env.CSRF_TOKEN_MAX_AGE ?? "600", 10)
  },
  database: {
    host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
    user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
    password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
    database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
    port: parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
    ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true"
  },
  smtp: {
    host: process.env.SMTP_HOST ?? "console",
    user: process.env.SMTP_USER ?? "bichard",
    password: process.env.SMTP_PASSWORD ?? "password",
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    tls: process.env.SMTP_TLS === "true"
  }
}

export default config
