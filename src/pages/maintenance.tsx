import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Pagination from "components/Pagination"
import Paragraph from "components/Paragraph"
import ServiceMessages from "components/ServiceMessages"
import config from "lib/config"
import getConnection from "lib/getConnection"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import React from "react"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import getServiceMessages from "useCases/getServiceMessages"
import logger from "utils/logger"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query } = context as AuthenticationServerSidePropsContext
    const connection = getConnection()
    const { page } = query as { page: string }
    const pageNumber = page ? parseInt(page, 10) : 0
    let serviceMessagesResult = await getServiceMessages(connection, pageNumber)

    if (isError(serviceMessagesResult)) {
      logger.error(serviceMessagesResult)
      serviceMessagesResult = { result: [], totalElements: 0 }
    }

    return {
      props: {
        serviceMessages: JSON.parse(JSON.stringify(serviceMessagesResult.result)),
        pageNumber,
        totalMessages: serviceMessagesResult.totalElements
      }
    }
  }
)

interface Props {
  serviceMessages: ServiceMessage[]
  pageNumber: number
  totalMessages: number
}

const Maintenance = ({ serviceMessages, pageNumber, totalMessages }: Props) => (
  <>
    <Head>
      <title>{"Maintenance"}</title>
    </Head>

    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 data-test="404_header" className="govuk-heading-xl">
            {"Sorry, the service is unavailable"}
          </h1>
          <Paragraph>{"You will be able to use the service soon"}</Paragraph>
        </GridColumn>

        <GridColumn width="one-third">
          <h2 className="govuk-heading-m">{"Latest service messages"}</h2>

          <ServiceMessages messages={serviceMessages} />

          <Pagination
            pageNumber={pageNumber}
            totalItems={totalMessages}
            maxItemsPerPage={config.maxServiceMessagesPerPage}
            href="/"
            className="govuk-!-font-size-16"
          />
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default Maintenance
