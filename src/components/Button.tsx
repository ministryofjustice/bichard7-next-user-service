import { ReactNode } from "react"
import classnames from "classnames"

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

const Button = ({ children, variant, noDoubleClick, id, className }: Props) => {
  const classes = classnames(getButtonClass(variant), className && { [className]: !!className })

  return (
    <button
      type="submit"
      className={classes}
      data-module="govuk-button"
      data-prevent-double-click={noDoubleClick}
      id={id}
    >
      {children}
    </button>
  )
}

export default Button
