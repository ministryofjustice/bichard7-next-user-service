import config from "lib/config"
import Link from "./Link"

interface Props {
  sendAgainUrl: string
}

const NotReceivedEmail = ({ sendAgainUrl }: Props) => {
  const { contactUrl } = config
  return (
    <>
      <p className="govuk-body">
        {
          "You need to use the exact email address for your account in the Bichard system. If you're having problems receiving the email, please "
        }
        <b>{"try using the older PNN version of your email address."}</b>
      </p>

      <details className="govuk-details" data-module="govuk-details">
        {" "}
        <summary className="govuk-details__summary" id="check-email">
          {" "}
          <span className="govuk-details__summary-text">{" I still have not received the email "}</span>{" "}
        </summary>
        <div className="govuk-details__text">
          <p>{"The email may take a few minutes to arrive."}</p>
          <p>
            {"Check your spam or junk folder – if it still has not arrived, you can "}
            <Link href={sendAgainUrl}>{"ask for it to be sent again"}</Link>
            {". Make sure you have entered your email address correctly."}
          </p>
          <p>
            {"If you no longer have access to your email address you will need to "}
            <Link href={contactUrl}>{"contact us"}</Link>
            {"."}
          </p>
        </div>
      </details>
    </>
  )
}

export default NotReceivedEmail
