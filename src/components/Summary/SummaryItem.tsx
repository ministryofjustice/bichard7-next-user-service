interface Props {
  label: string
  value: string
}

const SummaryItem = ({ label, value }: Props) => (
  <div className="govuk-summary-list__row">
    <dt className="govuk-summary-list__key">{label}</dt>
    <dd className="govuk-summary-list__value">{value}</dd>
  </div>
)

export default SummaryItem
