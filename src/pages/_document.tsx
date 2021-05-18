import Document, { Html, Head, Main, NextScript } from "next/document"

export default class GovUkDocument extends Document {
  render() {
    return (
      <Html className="govuk-template" lang="en">
        <Head />
        <body className="govuk-template__body">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
