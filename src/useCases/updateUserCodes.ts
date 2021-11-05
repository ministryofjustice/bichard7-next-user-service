import QueryString from "qs"

const updateUserCodes = (
  oldCodes: string | undefined,
  listOfCodes: { id: string; name: string }[],
  typeOfCodes: string,
  formData: QueryString.ParsedQs
) => {
  let result = oldCodes || ""

  const codes = result.split(",")
  for (let i = 0; i < codes.length; i += 1) {
    const code = `${typeOfCodes}-${codes[i]}`

    if (!(`${typeOfCodes}-${code}` in formData)) {
      result = result.replace(`${codes[i]},`, "")
    }
  }

  for (let i = 0; i < listOfCodes.length; i += 1) {
    const code = `${typeOfCodes}-${listOfCodes[i].id}`
    if (code in formData && !result.includes(code)) {
      result = `${result + listOfCodes[i].id},`
    }
  }

  return result
}

export default updateUserCodes
