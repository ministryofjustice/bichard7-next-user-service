import { AppProps } from "next/app"
import { FunctionComponent, useEffect } from "react";
import "../styles/globals.scss";

const App: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}: AppProps): JSX.Element => {
  useEffect(() => {
    document.body.className = document.body.className
      ? document.body.className + " js-enabled"
      : "js-enabled";

    const GOVUKFrontend = require("govuk-frontend");
    GOVUKFrontend.initAll();
  }, []);

  return <Component {...pageProps} />
}

export default App