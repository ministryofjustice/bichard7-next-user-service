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
import { format } from "date-fns"
import Pagination from "components/Pagination"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, authentication, query } = context as AuthenticationServerSidePropsContext

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

    return {
      props: {
        currentUser,
        hasAccessToUserManagement,
        hasAccessToAuditLogging,
        hasAccessToBichard,
        serviceMessages: JSON.parse(JSON.stringify(serviceMessagesResult.result)),
        pageNumber,
        totalMessages: serviceMessagesResult.totalElements
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
}

const Home = ({
  currentUser,
  hasAccessToUserManagement,
  hasAccessToAuditLogging,
  hasAccessToBichard,
  serviceMessages,
  pageNumber,
  totalMessages
}: Props) => {
  return (
    <>
      <Head>
        <title>{"Home"}</title>
      </Head>
      <Layout user={currentUser}>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">
              {"Welcome "}
              {currentUser?.forenames}
              {` `}
              {currentUser?.surname}
            </h1>

            <h2 className="govuk-heading-m">{"Latest service messages"}</h2>

            {serviceMessages.totalElements === 0 && (
              <p className="govuk-body">{"There are no service messages to display."}</p>
            )}

            {serviceMessages.map((message) => (
              <>
                <div className="govuk-grid-row">
                  <div className="govuk-grid-column-full">
                    <p className="govuk-body">
                      <time
                        className="govuk-!-font-weight-bold govuk-!-font-size-16"
                        aria-label="time"
                        title={format(new Date(message.createdAt), "dd MMMM yyyy HH:mm")}
                      >
                        {format(new Date(message.createdAt), "dd MMMM yyyy")}
                      </time>
                      <br />
                      {message.message}
                    </p>
                  </div>
                </div>
              </>
            ))}

            <Pagination
              pageNumber={pageNumber}
              totalItems={totalMessages}
              maxItemsPerPage={config.maxServiceMessagesPerPage}
              href="/home"
            />
          </div>
          <div className="govuk-grid-column-one-third">
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            <h3 className="govuk-heading-m" id="services-title">
              {"Quick access"}
            </h3>
            <nav role="navigation" aria-labelledby="services-title">
              <ul className="govuk-list govuk-!-font-size-16">
                {hasAccessToBichard && (
                  <li>
                    <Link href={config.bichardRedirectURL} className="govuk-link govuk-link--no-underline">
                      {"Bichard"}
                    </Link>
                  </li>
                )}
                {hasAccessToUserManagement && (
                  <li>
                    <Link href="/users" className="govuk-link govuk-link--no-underline">
                      {"User management"}
                    </Link>
                  </li>
                )}
                {hasAccessToAuditLogging && (
                  <li>
                    <Link href={config.auditLoggingRedirectURL} className="govuk-link govuk-link--no-underline">
                      {"Audit logging"}
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

            <h3 className="govuk-heading-m">{"Need help?"}</h3>
            <p className="govuk-body">
              {"If you need help, you can "}
              <Link href={config.contactUrl}>{"contact support"}</Link>
              {"."}
            </p>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home
