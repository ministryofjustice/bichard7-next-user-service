import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"

interface Props {
  url: string
}

const LoginEmail = ({ url }: Props) => (
  <>
    <h1>{"Sign in to Bichard"}</h1>

    <p>{"Click here to sign in to Bichard:"}</p>
    <p>{url}</p>
  </>
)

const LoginEmailText = ({ url }: Props) =>
  `Click here to log in to Bichard:
  ${url}
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
