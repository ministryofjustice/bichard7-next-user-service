import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import EmailLayout from "./EmailLayout"

type Status = "old" | "new"

interface Props {
  status: Status
}

const statusMessage = (status: Status) =>
  status === "old"
    ? "You will no longer be able to sign in to Bichard with this email address."
    : "You will now need to use this email address to sign in to Bichard."

const EmailChangedEmail = ({ status }: Props): JSX.Element => {
  return (
    <EmailLayout
      paragraphs={[
        "Hi,",
        "The email address associated with your Bichard account has been changed successfully.",
        statusMessage(status)
      ]}
      title={"Bichard password changed"}
    />
  )
}

const EmailChangedText = ({ status }: Props): string =>
  `Hi,

The email address associated with your Bichard account has been changed successfully.

${statusMessage(status)}
`

export default function generateEmailChangedEmail(props: Props): EmailContent {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const htmlEmail = <EmailChangedEmail {...props} />

  return {
    subject: "Bichard password changed",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: EmailChangedText(props)
  }
}
