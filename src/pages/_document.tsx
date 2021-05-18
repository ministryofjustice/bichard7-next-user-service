import Document, { Html, Head, Main, NextScript } from "next/document"

class GOVUKDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

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

export default GOVUKDocument
