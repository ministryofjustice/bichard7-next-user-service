import config from "lib/config"
import ButtonGroup from "./ButtonGroup"
import Link from "./Link"

interface Props {
  suggestedPassword: string
  suggestedPasswordUrl: string
}

const SuggestPassword = ({ suggestedPassword, suggestedPasswordUrl }: Props) => {
  const passwordRules = `Please ensure that your password has at least ${config.passwordMinLength} characters`
  return (
    <>
      <div className="govuk-hint">{passwordRules}</div>
      <ButtonGroup>
        <Link href={suggestedPasswordUrl}>{suggestedPassword ? "Suggest another password" : "Suggest a password"}</Link>
      </ButtonGroup>
      <div className="govuk-hint">{suggestedPassword}</div>
    </>
  )
}

export default SuggestPassword
