import Layout from "components/Layout"
import Head from "next/head"
import Link from "components/Link"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import User from "types/User"
import config from "lib/config"
import logger from "utils/logger"
import createRedirectResponse from "utils/createRedirectResponse"
import getUserServiceAccess from "useCases/getUserServiceAccess"
import getServiceMessages from "useCases/getServiceMessages"
import getConnection from "lib/getConnection"
import ServiceMessage from "types/ServiceMessage"
import { isError } from "types/Result"
import Pagination from "components/Pagination"
import ServiceMessages from "components/ServiceMessages"
import ContactLink from "components/ContactLink"
import UserManagers from "components/UserManagers"
import getUserManagersForForce from "useCases/getUserManagersForForce"
import Paragraph from "components/Paragraph"
import GridRow from "components/GridRow"
import GridColumn from "components/GridColumn"

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
      logger.error(serviceMessagesResult)
      serviceMessagesResult = { result: [], totalElements: 0 }
    }

    const currentUserManagers = await getUserManagersForForce(connection, currentUser.visibleForces)

    if (isError(currentUserManagers)) {
      logger.error(currentUserManagers)
    }

    return {
      props: {
        currentUser,
        currentUserManagerNames: isError(currentUserManagers)
          ? [""]
          : currentUserManagers.map((cu) => (cu.forenames ? cu.forenames : "") + " " + (cu.surname ? cu.surname : "")),
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
  currentUserManagerNames: string[]
  hasAccessToUserManagement: boolean
  hasAccessToAuditLogging: boolean
  hasAccessToBichard: boolean
  serviceMessages: ServiceMessage[]
  pageNumber: number
  totalMessages: number
}

const Home = ({
  currentUser,
  currentUserManagerNames,
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
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="govuk-heading-l">{`Welcome ${currentUser?.forenames} ${currentUser?.surname}`}</h1>

            {hasAccessToBichard && (
              <Link
                href={config.bichardRedirectURL}
                basePath={false}
                className="govuk-button govuk-button--start govuk-!-margin-top-5"
                id="bichard-link"
              >
                {"Access Bichard"}
                <svg
                  className="govuk-button__start-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17.5"
                  height="19"
                  viewBox="0 0 33 40"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
                </svg>
              </Link>
            )}

            {!hasAccessToBichard && (
              <Paragraph>
                {
                  "You do not have any Bichard groups associated with your account. If this is incorrect, please contact a User Manager in your force."
                }
              </Paragraph>
            )}

            {(hasAccessToUserManagement || hasAccessToAuditLogging) && (
              <>
                <h3 className="govuk-heading-m govuk-!-margin-top-5" id="services-title">
                  {"Quick access"}
                </h3>
                <nav role="navigation" aria-labelledby="services-title">
                  <ul className="govuk-list">
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
                          basePath={false}
                          className="govuk-link govuk-link--no-underline"
                          id="audit-logging-link"
                        >
                          {"Audit logging"}
                        </Link>
                      </li>
                    )}
                  </ul>
                </nav>
              </>
            )}

            <h3 className="govuk-heading-m govuk-!-margin-top-5">{"Need help?"}</h3>

            <UserManagers userManagerNames={currentUserManagerNames} />

            <Paragraph>
              {"If you need help with anything else, you can "}
              <ContactLink>{"contact support"}</ContactLink>
              {"."}
            </Paragraph>

            <Paragraph>
              {"If you have any feedback you wish to share, please use "}
              <Link href={"/feedback"}>{"this link"}</Link>
              {"."}
            </Paragraph>
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
      <script src={`forces.js?forceID=${currentUser?.visibleForces}`} async />
    </>
  )
}

export default Home
