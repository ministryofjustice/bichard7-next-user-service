import Layout from "components/Layout"
import Head from "next/head"
import Link from "components/Link"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import User from "types/User"
import config from "lib/config"
import createRedirectResponse from "utils/createRedirectResponse"
import getUserServiceAccess from "useCases/getUserServiceAccess"
import getServiceMessages from "useCases/getServiceMessages"
import getConnection from "lib/getConnection"
import ServiceMessage from "types/ServiceMessage"
import { isError } from "types/Result"
import Pagination from "components/Pagination"
import ServiceMessages from "components/ServiceMessages"
import addQueryParams from "utils/addQueryParams"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, authentication, query, req } = context as AuthenticationServerSidePropsContext

    if (!currentUser || !authentication) {
      return createRedirectResponse("/login")
    }

    const { page } = query as { page: string }
    const pageNumber = page ? parseInt(page, 10) : 0

    const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToAuditLogging } =
      getUserServiceAccess(authentication)
    const connection = getConnection()
    let serviceMessagesResult = await getServiceMessages(connection, pageNumber)

    if (isError(serviceMessagesResult)) {
      console.error(serviceMessagesResult)
      serviceMessagesResult = { result: [], totalElements: 0 }
    }

    const bichardUrl = addQueryParams(config.bichardRedirectURL, {
      [config.tokenQueryParamName]: req.cookies[config.authenticationCookieName]
    })

    return {
      props: {
        currentUser,
        hasAccessToUserManagement,
        hasAccessToAuditLogging,
        hasAccessToBichard,
        serviceMessages: JSON.parse(JSON.stringify(serviceMessagesResult.result)),
        pageNumber,
        totalMessages: serviceMessagesResult.totalElements,
        bichardUrl
      }
    }
  }
)

interface Props {
  currentUser?: Partial<User>
  hasAccessToUserManagement: boolean
  hasAccessToAuditLogging: boolean
  hasAccessToBichard: boolean
  serviceMessages: ServiceMessage[]
  pageNumber: number
  totalMessages: number
  bichardUrl: string
}

const Home = ({
  currentUser,
  hasAccessToUserManagement,
  hasAccessToAuditLogging,
  hasAccessToBichard,
  serviceMessages,
  pageNumber,
  totalMessages,
  bichardUrl
}: Props) => {
  return (
    <>
      <Head>
        <title>{"Home"}</title>
      </Head>
      <Layout user={currentUser}>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">{`Welcome ${currentUser?.forenames} ${currentUser?.surname}`}</h1>

            <h3 className="govuk-heading-m" id="services-title">
              {"Quick access"}
            </h3>
            <nav role="navigation" aria-labelledby="services-title">
              <ul className="govuk-list">
                {hasAccessToBichard && (
                  <li>
                    <Link href={bichardUrl} className="govuk-link govuk-link--no-underline" id="bichard-link">
                      {"Bichard"}
                    </Link>
                  </li>
                )}
                {hasAccessToUserManagement && (
                  <li>
                    <Link href="/users" className="govuk-link govuk-link--no-underline" id="user-management-link">
                      {"User management"}
                    </Link>
                  </li>
                )}
                {hasAccessToAuditLogging && (
                  <li>
                    <Link
                      href={config.auditLoggingURL}
                      className="govuk-link govuk-link--no-underline"
                      id="audit-logging-link"
                    >
                      {"Audit logging"}
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <h3 className="govuk-heading-m govuk-!-margin-top-7">{"Need help?"}</h3>
            <p className="govuk-body">
              {"If you need help, you can "}
              <Link href={config.contactUrl}>{"contact support"}</Link>
              {"."}
            </p>
          </div>
          <div className="govuk-grid-column-one-third">
            <h2 className="govuk-heading-m">{"Latest service messages"}</h2>

            <ServiceMessages messages={serviceMessages} />

            <Pagination
              pageNumber={pageNumber}
              totalItems={totalMessages}
              maxItemsPerPage={config.maxServiceMessagesPerPage}
              href="/home"
              className="govuk-!-font-size-16"
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home
