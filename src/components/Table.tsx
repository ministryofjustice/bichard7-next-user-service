export type TableHeader = [string, string]

export type TableHeaders = Array<TableHeader>

export type Props = {
  tableHeaders: TableHeaders
  tableTitle: string
  tableData: StringMap[]
}

export type StringMap = {
  [key: string]: string
}

const Table = ({ tableTitle, tableHeaders, tableData }: Props) => {
  return (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">{tableTitle}</caption>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          {tableHeaders.map((header: TableHeader) => (
            <th key={header[0]} scope="col" className="govuk-table__header">
              {header[1]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {tableData.map((row: StringMap) => (
          <tr key={Object.values(row).join("")} className="govuk-table__row">
            {tableHeaders.map((header: TableHeader) => (
              <td key={header[0]} className="govuk-table__cell">
                {row[header[0]]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
