import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import User from "types/User"

interface Props {
  url: string
  user: User
}

const PasswordResetEmail = ({ url, user }: Props) => (
  <>
    <h1>{"Bichard password reset"}</h1>

    <p>
      {"Hi "}
      {user.forenames} {user.surname}
      {","}
    </p>

    <p>{"Click here to reset your password:"}</p>
    <p>{url}</p>
  </>
)

const PasswordResetEmailText = ({ url, user }: Props) =>
  `Hi ${user.forenames} ${user.surname},

  Click here to reset your password:
  ${url}
  `

export default function generatePasswordResetEmail(props: Props): EmailContent {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const htmlEmail = <PasswordResetEmail {...props} />

  return {
    subject: "Bichard password reset request",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: PasswordResetEmailText(props)
  }
}
