import { ReactNode } from "react"

type ButtonVariant = "default" | "warning"

interface Props {
  children: ReactNode
  variant?: ButtonVariant
  noDoubleClick?: boolean
}

const getButtonClass = (variant?: ButtonVariant): string => {
  const variantClass = !variant || variant === "default" ? "" : ` govuk-button--${variant}`
  return `govuk-button${variantClass}`
}

const Button = ({ children, variant, noDoubleClick }: Props) => (
  <button
    type="submit"
    className={getButtonClass(variant)}
    data-module="govuk-button"
    data-prevent-double-click={noDoubleClick}
  >
    {children}
  </button>
)

export default Button
