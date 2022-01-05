import Accordion from "components/Accordion"
import AccordionItem from "components/AccordionItem"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import config from "lib/config"
import Head from "next/head"
import faqJSON from "../faqs.json"

interface faqJson {
  lastUpdated: string
  faqs: Array<faqElement>
}

interface faqElement {
  id: string
  question: string
  answer: string
}

export const getStaticProps = () => {
  return {
    props: faqJSON
  }
}

const faq = (faqJson: faqJson) => (
  <>
    <Head>
      <title>{"FAQ"}</title>
    </Head>

    <Layout>
      <GridRow>
        <h1 data-test="faq_heading" className="govuk-heading-xl">
          {"Frequently Asked Questions"}
        </h1>

        <div data-test="faq_last-updated" className="govuk-hint">
          {"Last Updated: "}
          {faqJson.lastUpdated}
        </div>

        <p className="govuk-body">
          {"Before contacting support, please check to see if your query is already answered by the information below."}
        </p>

        <Accordion>
          {faqJson.faqs.map((faqItem) => (
            <AccordionItem heading={faqItem.question} id={faqItem.id} key={faqItem.id}>
              <p className="govuk-body">{faqItem.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>

        <h3 className="govuk-heading-m">{"Still need help?"}</h3>
        <p className="govuk-body">
          {"If your query isn't answered by the above information, then you can "}
          <Link href={config.serviceNowUrl}>{"raise a ticket with the service desk"}</Link>
          {"."}
        </p>
      </GridRow>
    </Layout>
  </>
)

export default faq
