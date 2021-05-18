import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Button = ({ children }: Props) => (
  <button type="submit" className="govuk-button" data-module="govuk-button">
    {children}
  </button>
)

export default Button
