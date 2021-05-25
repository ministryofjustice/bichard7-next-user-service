export interface UserServiceConfig {
  bichardRedirectURL: string
}

const config: UserServiceConfig = {
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "https://localhost:9443/bichard-ui/"
}

export default config
