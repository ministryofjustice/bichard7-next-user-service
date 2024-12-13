interface Props {
  label?: string
  name: string
  hint?: string
  className?: string
  error?: string | boolean
  width?: "5" | "10" | "20" | "30"
  id?: string
  type?: string
  readOnly?: boolean
  disabled?: boolean
  mandatory?: boolean
  autocomplete?: boolean
  value?: string
}

const TextInput = ({
  label,
  hint,
  error,
  className,
  name,
  width,
  id,
  readOnly = false,
  disabled = false,
  type = "text",
  value,
  autocomplete = true,
  mandatory = false
}: Props) => {
  const hintElementId = `${name}-hint`
  const errorElementId = `${name}-error`
  const widthClassName = width ? ` govuk-input--width-${width}` : ""
  const hasError = error && !readOnly

  return (
    <div className={`govuk-form-group${className ? ` ${className}` : ""}${hasError ? " govuk-form-group--error" : ""}`}>
      {label && (
        <label className="govuk-label" htmlFor={name}>
          {label}
          {mandatory && " *"}
        </label>
      )}

      {hint && (
        <div id={hintElementId} className="govuk-hint">
          {hint}
        </div>
      )}
      {!!hasError && error !== true && (
        <span data-test={`text-input_${name}-error`} id={errorElementId} className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {error}
        </span>
      )}
      <input
        className={`govuk-input${widthClassName}${hasError ? " govuk-input--error" : ""}`}
        id={id || name}
        name={name}
        data-test={`text-input_${name}`}
        type={type}
        defaultValue={value}
        readOnly={readOnly}
        disabled={disabled}
        autoComplete={autocomplete ? "on" : "off"}
        aria-autocomplete={autocomplete ? "both" : "none"}
        aria-describedby={`${hint ? hintElementId : ""} ${hasError ? errorElementId : ""}`}
      />
    </div>
  )
}

export default TextInput
