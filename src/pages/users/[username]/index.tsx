import Layout from "components/Layout"
import Head from "next/head"
import User from "types/User"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { Summary, SummaryItem } from "components/Summary"
import BackLink from "components/BackLink"
import ButtonGroup from "components/ButtonGroup"
import getConnection from "lib/getConnection"
import { getUserByUsername } from "useCases"
import Link from "components/Link"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { ParsedUrlQuery } from "querystring"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import logger from "utils/logger"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import usersHaveSameForce from "lib/usersHaveSameForce"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, currentUser } = context as AuthenticationServerSidePropsContext
    const { username } = query as { username: string }

    if (!currentUser) {
      logger.error("Unable to determine current user")
      return createRedirectResponse("/login")
    }

    const connection = getConnection()
    const user = await getUserByUsername(connection, username)

    if (isError(user)) {
      logger.error(user)
      return createRedirectResponse("/500")
    }

    if (!user || !usersHaveSameForce(currentUser, user)) {
      return {
        notFound: true
      }
    }

    return {
      props: { user, currentUser }
    }
  }
)

interface Props {
  user: User
  currentUser?: Partial<User>
}

const Users = ({ user, currentUser }: Props) => (
  <>
    <Head>
      <title>{"User details"}</title>
    </Head>
    <Layout user={currentUser}>
      <h2 className="govuk-heading-l">{"User details"}</h2>
      <Summary>
        <SummaryItem label="Username" value={user.username} />
        <SummaryItem label="Forename(s)" value={user.forenames} />
        <SummaryItem label="Surname" value={user.surname} />
        <SummaryItem label="Email address" value={user.emailAddress} />
        <SummaryItem label="Endorsed by" value={user.endorsedBy} />
        <SummaryItem label="Organisation" value={user.orgServes} />
        <SummaryItem label="Visible Forces" value={user.visibleForces} />
        <SummaryItem label="Visible Courts" value={user.visibleCourts} />
        <SummaryItem label="Excluded Triggers" value={user.excludedTriggers} />
      </Summary>
      <ButtonGroup>
        <Link data-test="edit-user-view" href={`${user.username}/edit`}>
          {"Edit details"}
        </Link>
        <Link data-test="delete-user-view" href={`${user.username}/delete`}>
          {"Delete account"}
        </Link>
      </ButtonGroup>
      <BackLink href="/users" />
    </Layout>
  </>
)

export default Users
