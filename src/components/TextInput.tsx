interface Props {
  id: string
  label?: string
  name?: string
  type?: string
}

const TextInput = ({ id, label, name, type }: Props) => {
  const inputName = name || id

  return (
    <div className="govuk-form-group">
      {!!label && (
        <label className="govuk-label" htmlFor={inputName}>
          {label}
        </label>
      )}
      <input className="govuk-input" id={id} name={inputName} type={type} />
    </div>
  )
}

export default TextInput
