import { ReactNode } from "react"

type ButtonVariant = "default" | "warning"

interface Props {
  children: ReactNode
  variant?: ButtonVariant
  noDoubleClick?: boolean
  id?: string
  className?: string
}

const getButtonClass = (variant?: ButtonVariant): string => {
  const variantClass = !variant || variant === "default" ? "" : ` govuk-button--${variant}`
  return `govuk-button${variantClass}`
}

const Button = ({ children, variant, noDoubleClick, id, className }: Props) => (
  <button
    type="submit"
    className={`${getButtonClass(variant)}${className ? ` ${className}` : ""}`}
    data-module="govuk-button"
    data-prevent-double-click={noDoubleClick}
    id={id}
  >
    {children}
  </button>
)

export default Button
