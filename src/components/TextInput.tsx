import classnames from "classnames"

interface Props {
  id: string
  label?: string
  name?: string
  type?: string
  width?: string
  value?: string
  defaultValue?: string
  isError?: boolean
  disabled?: boolean
  className?: string
}

const TextInput = ({
  id,
  label,
  name,
  type,
  width,
  value,
  defaultValue,
  className,
  isError = false,
  disabled = false
}: Props) => {
  const inputName = name || id
  const errorClassName = isError ? " govuk-input--error" : ""
  const widthClassName = width ? ` govuk-input--width-${width}` : ""

  const classes = classnames("govuk-form-group", {
    [className as string]: !!className
  })

  return (
    <div className={classes}>
      {!!label && (
        <label className="govuk-label" htmlFor={inputName}>
          {label}
        </label>
      )}
      <input
        defaultValue={defaultValue}
        value={value}
        className={`govuk-input${widthClassName}${errorClassName}`}
        id={id}
        name={inputName}
        type={type}
        disabled={disabled}
      />
    </div>
  )
}

export default TextInput
