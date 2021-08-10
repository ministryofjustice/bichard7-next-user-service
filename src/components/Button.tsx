import { ReactNode } from "react"

interface Props {
  noDoubleClick?: boolean
  children: ReactNode
}

const Button = ({ noDoubleClick, children }: Props) => (
  <button type="submit" className="govuk-button" data-module="govuk-button" data-prevent-double-click={noDoubleClick}>
    {children}
  </button>
)

export default Button
