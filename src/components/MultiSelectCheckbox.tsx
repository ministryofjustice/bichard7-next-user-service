import Code from "types/Code"

interface Props {
  name: string
  values?: string
  codes: Code[]
}

const MultiSelectCheckbox = ({ name, values, codes }: Props) => {
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
          />
        )}

        <label className="govuk-label govuk-checkboxes__label" htmlFor={codes[i].id}>
          {`${codes[i].id} - ${codes[i].name}`}
        </label>
      </div>
    )
  }

  return (
    <div className="govuk-checkboxes" data-module="govuk-checkboxes">
      {codeCheckboxes}
    </div>
  )
}

export default MultiSelectCheckbox
