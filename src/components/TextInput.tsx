interface Props {
  id: string
  label?: string
  name?: string
  type?: string
  width?: string
}

const TextInput = ({ id, label, name, type, width }: Props) => {
  const inputName = name || id
  const widthClassName = width ? ` govuk-input--width-${width}` : ""

  return (
    <div className="govuk-form-group">
      {!!label && (
        <label className="govuk-label" htmlFor={inputName}>
          {label}
        </label>
      )}
      <input className={`govuk-input${widthClassName}`} id={id} name={inputName} type={type} />
    </div>
  )
}

export default TextInput
