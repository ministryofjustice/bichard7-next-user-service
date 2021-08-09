import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ButtonSecondary = ({ children }: Props) => (
  <button type="submit" className="govuk-button govuk-button--secondary" data-module="govuk-button">
    {children}
  </button>
)

export default ButtonSecondary
