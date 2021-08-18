import config from "lib/config"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  csrfToken: string
  method: string
}

const Form = ({ children, csrfToken, method }: Props) => {
  const { tokenName } = config.csrf

  return (
    <form method={method}>
      {children}
      <input type="hidden" name={tokenName} value={csrfToken} />
    </form>
  )
}

export default Form
