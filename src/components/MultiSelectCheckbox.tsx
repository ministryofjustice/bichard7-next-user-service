import Code from "types/Code"

interface Props {
  label: string
  name: string
  values?: string
  codes: Code[]
}

const MultiSelectCheckbox = ({ label, name, values, codes }: Props) => {
  const codeCheckboxes = []

  for (let i = 0; i < codes.length; i++) {
    codeCheckboxes.push(
      <div className="govuk-checkboxes__item">
        {values?.includes(codes[i].id) ? (
          <input
            className="govuk-checkboxes__input"
            id={`${name}-${codes[i].id}`}
            name={`${name}-${codes[i].id}`}
            type="checkbox"
            value="true"
            defaultChecked
          />
        ) : (
          <input
            className="govuk-checkboxes__input"
            id={`${name}-${codes[i].id}`}
            name={`${name}-${codes[i].id}`}
            type="checkbox"
            value="false"
          />
        )}

        <label className="govuk-label govuk-checkboxes__label" htmlFor={codes[i].id}>
          {`${codes[i].id} - ${codes[i].name}`}
        </label>
      </div>
    )
  }

  return (
    <>
      <h3 className="govuk-heading-m govuk-!-margin-top-5">{label}</h3>
      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        {codeCheckboxes}
      </div>
    </>
  )
}

export default MultiSelectCheckbox
