import { ReactNode } from "react"

interface Props {
  title: string
  children: ReactNode
}

const ErrorSummary = ({ title, children }: Props) => (
  <div
    className="govuk-error-summary"
    aria-labelledby="error-summary-title"
    role="alert"
    tabIndex={-1}
    data-module="govuk-error-summary"
  >
    <h2 className="govuk-error-summary__title" id="error-summary-title">
      {title}
    </h2>
    <div className="govuk-error-summary__body">{children}</div>
  </div>
)

export default ErrorSummary
