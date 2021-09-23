import { addBasePath } from "next/dist/shared/lib/router/router"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  className?: string
  "data-test"?: string
  href: string
  id?: string
  rel?: string
}

const Link = ({ children, className, "data-test": dataTest, href, id, rel }: Props) => (
  <a data-test={dataTest} href={addBasePath(href)} className={className || "govuk-link"} id={id} rel={rel}>
    {children}
  </a>
)

export default Link
