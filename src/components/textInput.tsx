import { ReactNode } from "react"

interface Props {
  id: string
  label?: string
  name?: string
  type?: string
}

const TextInput = ({ id, label, name, type }: Props) => {
  const inputName = name || id

  let labelComponent: ReactNode
  if (label) {
    labelComponent = (
      <label className="govuk-label" htmlFor={inputName}>
        {label}
      </label>
    )
  }

  return (
    <div className="govuk-form-group">
      {labelComponent}
      <input className="govuk-input" id={id} name={inputName} type={type} />
    </div>
  )
}

export default TextInput
