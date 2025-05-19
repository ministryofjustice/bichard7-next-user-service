import { useEffect, useState } from "react"
import config from "lib/config"
import { UiType } from "types/UiType"

const useReturnToCaseListUrl = () => {
  const [url, setUrl] = useState("")

  useEffect(() => {
    const uiType = localStorage.getItem("currentUi")
    setUrl(uiType === UiType.New ? config.newBichardRedirectURL : config.bichardRedirectURL)
  }, [])

  return url
}

export default useReturnToCaseListUrl
