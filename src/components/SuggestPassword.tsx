import config from "lib/config"
import Link from "./Link"

interface Props {
  suggestedPassword?: string
  suggestedPasswordUrl?: string
}

const SuggestPassword = ({ suggestedPassword, suggestedPasswordUrl }: Props) => {
  return (
    <>
      <h3 className="govuk-heading-m govuk-!-margin-top-6">{"Password policy requirements"}</h3>
      <p className="govuk-body">{"Your password must meet the following requirements:"}</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>{`It has at least ${config.passwordMinLength} characters`}</li>
        <li>{"It does not contain your details such as first name, last name, username, and email address"}</li>
        <li>{"It is not easy to guess"}</li>
      </ul>
      <h3 className="govuk-heading-m govuk-!-margin-top-6">{"Not sure what password to choose?"}</h3>
      {!suggestedPassword && (
        <p className="govuk-body">
          {"If you are not sure what password to choose, we can "}
          <Link href={suggestedPasswordUrl ?? ""}>{"suggest a password"}</Link>
          {"."}
        </p>
      )}
      {suggestedPassword && (
        <>
          <p className="govuk-body">{"We suggest you to choose this password:"}</p>
          <div className="govuk-inset-text">{suggestedPassword}</div>
          <p className="govuk-body">
            {"If you want this password, you can type it in the fields above, or you can copy and paste the password."}
          </p>
          <p className="govuk-body">
            {"If you don't want this password, we can "}
            <Link href={suggestedPasswordUrl ?? ""}>{"suggest another password"}</Link>
            {"."}
          </p>
        </>
      )}
    </>
  )
}

export default SuggestPassword
