import Argon2Config from "types/Argon2Config"
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
  argon2id: Argon2Config
  auditLoggerType: string
  authenticationCookieName: string
  baseUrl: string
  bichardRedirectURL: string
  contactUrl: string
  cookieSecret: string
  csrf: CsrfConfig
  database: DatabaseConfig
  debugMode: string
  emailFrom: string
  emailVerificationExpiresIn: number
  incorrectDelay: number
  passwordMinLength: number
  redirectAccessList: string
  rememberEmailAddressCookieName: string
  rememberEmailAddressMaxAgeInMinutes: number
  suggestedPasswordNumWords: number
  suggestedPasswordMinWordLength: number
  suggestedPasswordMaxWordLength: number
  smtp: SmtpConfig
  tokenExpiresIn: string
  tokenIssuer: string
  tokenQueryParamName: string
  tokenSecret: string
  maxUsersPerPage: number
  verificationCodeLength: number
}

const config: UserServiceConfig = {
  argon2id: {
    hashLength: parseInt(process.env.ARGON2_HASH_LENGTH ?? "32", 10),
    memoryCost: parseInt(process.env.ARGON2_MEMORY_COST ?? "16384", 10),
    parallelism: parseInt(process.env.ARGON2_PARALLELISM ?? "2", 10),
    saltLength: 16,
    timeCost: parseInt(process.env.ARGON2ID_TIME_COST ?? "10", 10)
  },
  auditLoggerType: "console",
  authenticationCookieName: ".AUTH",
  baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/Authenticate",
  contactUrl: process.env.CONTACT_URL ?? "http://localhost:3000/contact-us",
  cookieSecret: process.env.COOKIE_SECRET ?? "OliverTwist",
  debugMode: "false",
  emailFrom: `Bichard <${process.env.EMAIL_FROM ?? "bichard@cjse.org"}>`,
  emailVerificationExpiresIn: parseInt(process.env.EMAIL_VERIFICATION_EXPIRY ?? "30", 10),
  incorrectDelay: parseInt(process.env.INCORRECT_DELAY ?? "10", 10),
  passwordMinLength: 8,
  redirectAccessList: process.env.REDIRECT_ACCESS_LIST ?? "localhost,",
  rememberEmailAddressCookieName: "LOGIN_EMAIL",
  rememberEmailAddressMaxAgeInMinutes: parseInt(process.env.REMEMBER_EMAIL_MAX_AGE ?? "1440", 10),
  suggestedPasswordNumWords: 3,
  suggestedPasswordMinWordLength: 3,
  suggestedPasswordMaxWordLength: 8,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ?? "15 seconds",
  tokenIssuer: process.env.TOKEN_ISSUER ?? "Bichard",
  tokenQueryParamName: process.env.TOKEN_QUERY_PARAM_NAME ?? "token",
  tokenSecret: process.env.TOKEN_SECRET ?? "OliverTwist",
  maxUsersPerPage: 10,
  verificationCodeLength: 6,
  csrf: {
    tokenName: "CSRFToken",
    cookieSecret: process.env.CSRF_COOKIE_SECRET ?? "OliverTwist1",
    formSecret: process.env.CSRF_FORM_SECRET ?? "OliverTwist2",
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
