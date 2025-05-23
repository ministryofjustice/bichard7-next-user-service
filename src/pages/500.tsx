import ContactLink from "components/ContactLink"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import useReturnToCaseListUrl from "hooks/useReturnToCaseListUrl"
import Head from "next/head"

const handleBack = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault()
  window.history.back()
}

const Custom500 = () => {
  const returnToCaseListUrl = useReturnToCaseListUrl()

  return (
    <>
      <Head>
        <title>{"Sorry, there is a problem with Bichard"}</title>
      </Head>
      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="govuk-heading-xl">{"Sorry, there is a problem with Bichard"}</h1>

            <Paragraph>{"Please try the following"}</Paragraph>
            <ol>
              <li>
                <Link href="#" onClick={handleBack}>
                  {"Click here to try the previous page again"}
                </Link>
              </li>
              <li>
                <Link href="/">{"Click here to go to the main login page"}</Link>
              </li>
            </ol>
            <Paragraph>
              <ContactLink>{"Contact support"}</ContactLink>
              {" if you have repeated problems with Bichard."}
            </Paragraph>
            <a href={returnToCaseListUrl} className="govuk-button" data-module="govuk-button">
              {"Return to case list"}
            </a>
          </GridColumn>
        </GridRow>
      </Layout>
    </>
  )
}

export default Custom500
