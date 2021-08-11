interface Props {
  href: string
}

const BackLink = ({ href }: Props) => (
  <a href={href} className="govuk-back-link">
    {"Back"}
  </a>
)

export default BackLink
