import { AppProps } from "next/app"
import { useEffect } from "react"
import "../styles/globals.scss"

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    document.body.className = document.body.className ? `${document.body.className} js-enabled` : "js-enabled"

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const GOVUKFrontend = require("govuk-frontend")
    GOVUKFrontend.initAll()
  }, [])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default App
