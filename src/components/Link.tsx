import { ReactNode } from "react"

interface Props {
  children: ReactNode
  href: string
  "data-test"?: string
}

const Link = ({ href, children, "data-test": dataTest }: Props) => (
  <a data-test={dataTest} href={href} className="govuk-link">
    {children}
  </a>
)

export default Link
