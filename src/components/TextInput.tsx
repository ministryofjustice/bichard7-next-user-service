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

  return (
    <div className={`govuk-form-group${className ? ` ${className}` : ""}`}>
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
