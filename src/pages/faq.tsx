import Accordion from "components/Accordion"
import AccordionItem from "components/AccordionItem"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
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
          {"FAQ"}
        </h1>

        <div data-test="faq_last-updated" id="last-updated" className="govuk-hint">
          {"Last Updated: "}
          {faqJson.lastUpdated}
        </div>

        <Accordion>
          {faqJson.faqs.map((faqItem) => (
            <AccordionItem heading={faqItem.question} id={faqItem.id} key={faqItem.id}>
              <p className="govuk-body">{faqItem.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </GridRow>
    </Layout>
  </>
)

export default faq
