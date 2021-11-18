import QueryString from "qs"

const updateUserCodes = (
  listOfCodes: { id: string; name: string }[],
  typeOfCodes: string,
  formData: QueryString.ParsedQs,
  flipResult = false
): string => {
  return listOfCodes
    .filter((code) => {
      if (!flipResult) {
        return `${typeOfCodes}${code.id}` in formData
      }
      return !(`${typeOfCodes}${code.id}` in formData)
    })
    .map((code) => code.id)
    .join(",")
}

export default updateUserCodes
