interface Props {
  id: string
  label?: string
  name?: string
  type?: string
  isError?: boolean
}

const TextInput = ({ id, label, name, type, isError = false }: Props) => {
  const inputName = name || id
  const className = isError ? "govuk-input govuk-input--error" : "govuk-input"

  return (
    <div className="govuk-form-group">
      {!!label && (
        <label className="govuk-label" htmlFor={inputName}>
          {label}
        </label>
      )}
      <input className={className} id={id} name={inputName} type={type} />
    </div>
  )
}

export default TextInput
