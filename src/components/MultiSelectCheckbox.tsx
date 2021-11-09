import Code from "types/Code"

interface Props {
  label: string
  name: string
  values?: string
  codes: Code[]
}

const MultiSelectCheckbox = ({ label, name, values, codes }: Props) => {
  const codeCheckboxes = codes.map((code) => {
    return (
      <div className="govuk-checkboxes__item" key={`${name}${code.id}`}>
        <input
          className="govuk-checkboxes__input"
          id={`${name}${code.id}`}
          name={`${name}${code.id}`}
          type="checkbox"
          value="true"
          defaultChecked={values?.includes(code.id)}
        />

        <label className="govuk-label govuk-checkboxes__label" htmlFor={code.id}>
          {`${code.id} - ${code.name}`}
        </label>
      </div>
    )
  })

  return (
    <>
      <div id="waste-hint" className="govuk-hint">
        {label}
      </div>
      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        {codeCheckboxes}
      </div>
    </>
  )
}

export default MultiSelectCheckbox
