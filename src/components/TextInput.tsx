interface Props {
  id: string
  label?: string
  name?: string
  type?: string
  width?: string
  value?: any
  defaultValue?: string
  isError?: boolean
}

const TextInput = ({ id, label, name, type, width, value, defaultValue, isError = false }: Props) => {
  const inputName = name || id
  const errorClassName = isError ? " govuk-input--error" : ""
  const widthClassName = width ? ` govuk-input--width-${width}` : ""

  return (
    <div className="govuk-form-group">
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
      />
    </div>
  )
}

export default TextInput
