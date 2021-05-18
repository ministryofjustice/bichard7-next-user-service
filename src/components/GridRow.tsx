import { ReactNode } from "react"

interface Props {
  aside?: ReactNode
  children: ReactNode
}

const GridRow = ({ aside, children }: Props) => {
  let asideComponent: ReactNode
  if (aside) {
    asideComponent = <div className="govuk-grid-column-one-third">{aside}</div>
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">{children}</div>
      {aside}
    </div>
  )
}

export default GridRow
