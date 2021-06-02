interface LocalAuthenticatorConfig {
  jwtSecret: string
  jwtExpiresIn: string
}

interface UserServiceConfig {
  bichardRedirectURL: string
  localAuthenticator: LocalAuthenticatorConfig
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/Authenticate",
  localAuthenticator: {
    jwtSecret: process.env.LOCAL_AUTH_TOKEN_SECRET || "OliverTwist",
    jwtExpiresIn: process.env.LOCAL_AUTH_TOKEN_EXPIRES_IN || "5 seconds"
  }
}

export default config
