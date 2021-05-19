import { ReactNode } from "react"

interface Props {
  aside?: ReactNode
  children: ReactNode
}

const GridRow = ({ aside, children }: Props) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">{children}</div>

      {!!aside && <div className="govuk-grid-column-one-third">{aside}</div>}
    </div>
  )
}

export default GridRow
