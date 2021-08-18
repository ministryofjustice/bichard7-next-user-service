export default interface CsrfConfig {
  tokenName: string
  cookieSecret: string
  formSecret: string
  cookieTokenMaximumAgeInSeconds: number
}
