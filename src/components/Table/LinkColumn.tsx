import KeyValuePair from "types/KeyValuePair"

interface Props {
  field: string
  href: (item: unknown) => string
  item?: KeyValuePair<string, string>
}
const LinkColumn = ({ field, href, item }: Props) => {
  if (!item) {
    return <>{"Error while rendering LinkColumn component. Item must have value."}</>
  }

  return (
    <a className="govuk-link" href={href(item)}>
      {String(item[field])}
    </a>
  )
}

export default LinkColumn
