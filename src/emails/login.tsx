import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import EmailLayout from "./EmailLayout"

interface Props {
  url: string
}

const LoginEmail = ({ url }: Props): JSX.Element => (
  <EmailLayout
    actionUrl={url}
    buttonLabel={"Sign in"}
    paragraphs={[
      "In order to sign in to Bichard, you need to confirm your email address. Please confirm your email address by clicking the button below.",
      "If you didn't request this email, you can safely ignore it."
    ]}
    title={"Sign in to Bichard"}
  />
)

const LoginEmailText = ({ url }: Props): string =>
  `Sign in to Bichard

In order to sign in to Bichard, you need to confirm your email address. Please confirm your email address by clicking the link below.

${url}

If you didn't request this email, you can safely ignore it.
`

export default function generateLoginEmail(props: Props): EmailContent {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const htmlEmail = <LoginEmail {...props} />

  return {
    subject: "Sign in to Bichard",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: LoginEmailText(props)
  }
}
