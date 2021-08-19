import ButtonGroup from "./ButtonGroup"
import Link from "./Link"

interface Props {
  suggestedPassword: string
  suggestedPasswordUrl: string
}

const SuggestPassword = ({ suggestedPassword, suggestedPasswordUrl }: Props) => {
  return (
    <>
      <ButtonGroup>
        <Link href={suggestedPasswordUrl}>{suggestedPassword ? "Suggest another password" : "Suggest a password"}</Link>
      </ButtonGroup>
      <div className="govuk-hint">{suggestedPassword}</div>
    </>
  )
}

export default SuggestPassword
