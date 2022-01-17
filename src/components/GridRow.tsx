import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GridRow = ({ children }: Props) => <div className="govuk-grid-row">{children}</div>

export default GridRow
