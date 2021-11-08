import QueryString from "qs"

const updateUserCodes = (
  listOfCodes: { id: string; name: string }[],
  typeOfCodes: string,
  formData: QueryString.ParsedQs
) => {
  let result = ""

  for (let i = 0; i < listOfCodes.length; i += 1) {
    const code = `${typeOfCodes}${listOfCodes[i].id}`
    if (code in formData && !result.includes(code)) {
      result = `${result + listOfCodes[i].id},`
    }
  }

  return result
}

export default updateUserCodes
