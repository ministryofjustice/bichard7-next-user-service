import Accordion from "components/Accordion"
import AccordionItem from "components/AccordionItem"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
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

        <Paragraph>
          {"Before contacting support, please check to see if your query is already answered by the information below."}
        </Paragraph>

        <Accordion>
          {faqJson.faqs.map((faqItem) => (
            <AccordionItem heading={faqItem.question} id={faqItem.id} key={faqItem.id} dataTest="faq-item">
              <Paragraph>{faqItem.answer}</Paragraph>
            </AccordionItem>
          ))}
        </Accordion>

        <h3 className="govuk-heading-m">{"Still need help?"}</h3>
        <Paragraph>
          {"If your query isn't answered by the above information, then you can "}
          <Link href={config.serviceNowUrl}>{"raise a ticket with the service desk"}</Link>
          {"."}
        </Paragraph>
      </GridRow>
    </Layout>
  </>
)

export default faq
