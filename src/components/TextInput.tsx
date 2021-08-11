interface Props {
  id: string
  label?: string
  name?: string
  type?: string
  width?: string
  isError?: boolean
}

const TextInput = ({ id, label, name, type, width, isError = false }: Props) => {
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
      <input className={`govuk-input${widthClassName}${errorClassName}`} id={id} name={inputName} type={type} />
    </div>
  )
}

export default TextInput
