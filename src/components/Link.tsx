import { addBasePath } from "next/dist/shared/lib/router/router"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  basePath?: boolean
  className?: string
  "data-test"?: string
  href: string
  id?: string
  rel?: string
}

const Link = ({ children, basePath = true, className, "data-test": dataTest, href, id, rel }: Props) => (
  <a
    data-test={dataTest}
    href={basePath ? addBasePath(href) : href}
    className={className || "govuk-link"}
    id={id}
    rel={rel}
  >
    {children}
  </a>
)

export default Link
