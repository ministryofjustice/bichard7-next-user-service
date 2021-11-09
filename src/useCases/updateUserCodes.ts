import QueryString from "qs"

const updateUserCodes = (
  listOfCodes: { id: string; name: string }[],
  typeOfCodes: string,
  formData: QueryString.ParsedQs
): string => {
  return listOfCodes
    .filter((code) => `${typeOfCodes}${code.id}` in formData)
    .map((code) => code.id)
    .join(",")
}

export default updateUserCodes
