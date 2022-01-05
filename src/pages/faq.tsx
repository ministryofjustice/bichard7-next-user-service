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

const faqItem = (faq: faqElement) => (
  <>
    <GridRow>
      <h4 data-test="faq_question">{faq.question}</h4>
      <p data-test="faq_answer">{faq.answer}</p>
    </GridRow>
  </>
)

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
      </GridRow>
      {faqJson.faqs.map(faqItem)}
    </Layout>
  </>
)

export default faq
