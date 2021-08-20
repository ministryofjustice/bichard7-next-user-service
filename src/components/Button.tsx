import { ReactNode } from "react"

type ButtonVariant = "default" | "warning"

interface Props {
  children: ReactNode
  variant?: ButtonVariant
  noDoubleClick?: boolean
  id?: string
}

const getButtonClass = (variant?: ButtonVariant): string => {
  const variantClass = !variant || variant === "default" ? "" : ` govuk-button--${variant}`
  return `govuk-button${variantClass}`
}

const Button = ({ children, variant, noDoubleClick, id }: Props) => (
  <button
    type="submit"
    className={getButtonClass(variant)}
    data-module="govuk-button"
    data-prevent-double-click={noDoubleClick}
    id={id}
  >
    {children}
  </button>
)

export default Button
