import { useEffect, useState } from "react"
import config from "lib/config"
import { Ui } from "types/Ui"

const useReturnToCaseListUrl = () => {
  const [url, setUrl] = useState("")

  useEffect(() => {
    const uiType = localStorage.getItem("currentUi")
    setUrl(uiType === Ui.New ? config.newBichardRedirectURL : config.bichardRedirectURL)
  }, [])

  return url
}

export default useReturnToCaseListUrl
