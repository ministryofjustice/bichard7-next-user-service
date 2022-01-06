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
  argon2: Argon2Config
  auditLoggerType: string
  auditLoggingURL: string
  authenticationCookieName: string
  baseUrl?: string
  bichardRedirectURL: string
  cookieSecret: string
  cookiesSecureOption: boolean
  csrf: CsrfConfig
  database: DatabaseConfig
  debugMode: string
  emailFrom: string
  emailVerificationExpiresIn: number
  incorrectDelay: number
  passwordMinLength: number
  rememberEmailAddressCookieName: string
  rememberEmailAddressMaxAgeInMinutes: number
  serviceNowUrl: string
  suggestedPasswordNumWords: number
  suggestedPasswordMinWordLength: number
  suggestedPasswordMaxWordLength: number
  smtp: SmtpConfig
  tokenExpiresIn: string
  tokenIssuer: string
  tokenSecret: string
  maxPasswordFailedAttempts: number
  maxServiceMessagesPerPage: number
  maxUsersPerPage: number
  verificationCodeLength: number
}

const config: UserServiceConfig = {
  argon2: {
    hashLength: 32,
    memoryCost: 15360,
    parallelism: 1,
    saltLength: 16,
    timeCost: 2
  },
  auditLoggerType: "console",
  auditLoggingURL: process.env.AUDIT_LOGGING_URL ?? "/audit-logging",
  authenticationCookieName: ".AUTH",
  baseUrl: process.env.BASE_URL,
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "/bichard-ui/InitialRefreshList",
  cookieSecret: process.env.COOKIE_SECRET ?? "OliverTwist",
  cookiesSecureOption: (process.env.COOKIES_SECURE ?? "true") === "true",
  debugMode: "false",
  emailFrom: `Bichard7 <${process.env.EMAIL_FROM ?? "bichard@cjse.org"}>`,
  emailVerificationExpiresIn: parseInt(process.env.EMAIL_VERIFICATION_EXPIRY ?? "30", 10),
  incorrectDelay: parseInt(process.env.INCORRECT_DELAY ?? "10", 10),
  passwordMinLength: 8,
  rememberEmailAddressCookieName: "LOGIN_EMAIL",
  rememberEmailAddressMaxAgeInMinutes: parseInt(process.env.REMEMBER_EMAIL_MAX_AGE ?? "1440", 10),
  serviceNowUrl: "https://mojprod.service-now.com/",
  suggestedPasswordNumWords: 3,
  suggestedPasswordMinWordLength: 3,
  suggestedPasswordMaxWordLength: 8,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ?? "10 minutes",
  tokenIssuer: process.env.TOKEN_ISSUER ?? "Bichard",
  tokenSecret: process.env.TOKEN_SECRET ?? "OliverTwist",
  maxPasswordFailedAttempts: 3,
  maxServiceMessagesPerPage: 5,
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
