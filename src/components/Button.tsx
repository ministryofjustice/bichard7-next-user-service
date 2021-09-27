import { ReactNode } from "react"
import classnames from "classnames"

type ButtonVariant = "default" | "warning" | "secondary"
interface Props {
  children: ReactNode
  variant?: ButtonVariant
  noDoubleClick?: boolean
  id?: string
  className?: string
  name?: string
  value?: string
}

const getButtonClass = (variant?: ButtonVariant): string => {
  const variantClass = !variant || variant === "default" ? "" : ` govuk-button--${variant}`
  return `govuk-button${variantClass}`
}

const Button = ({ children, variant, noDoubleClick, id, className, name, value }: Props) => {
  const classes = classnames(getButtonClass(variant), className && { [className]: !!className })

  return (
    <button
      type="submit"
      className={classes}
      name={name}
      value={value}
      data-module="govuk-button"
      data-prevent-double-click={noDoubleClick}
      id={id}
    >
      {children}
    </button>
  )
}

export default Button
