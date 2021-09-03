import { ReactNode } from "react"

interface Props {
  children: ReactNode
  csrfToken: string
  method: string
}

const Form = ({ children, csrfToken, method }: Props) => {
  return (
    <form method={method}>
      <input type="hidden" name="token" value={csrfToken} />
      {children}
    </form>
  )
}

export default Form
