import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import UserDetails from "types/UserDetails"

interface Props {
  url: string
  user: UserDetails
}

const NewUserEmail = ({ url, user }: Props) => (
  <>
    <h1>{"Finish Bichard account setup"}</h1>

    <p>
      {"Hi "}
      {user.forenames} {user.surname}
      {","}
    </p>

    <p>{"Click here to set your password:"}</p>
    <p>{url}</p>
  </>
)

const NewUserEmailText = ({ url, user }: Props) =>
  `Hi ${user.forenames} ${user.surname},

  Click here to set your password:
  ${url}
  `

export default function generateNewUserEmail(props: Props): EmailContent {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const htmlEmail = <NewUserEmail {...props} />

  return {
    subject: "Finish Bichard account setup",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: NewUserEmailText(props)
  }
}
