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
import AuthenticationServerSideProps from "types/AuthenticationServerSideProps"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, currentUser } = context as AuthenticationServerSideProps
    const { username } = query
    const connection = getConnection()
    const user = await getUserByUsername(connection, username as string)

    if (isError(user)) {
      return createRedirectResponse("/error")
    }

    if (!user) {
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
      <BackLink href="/users" />
      <h2 className="govuk-heading-m">{"User details"}</h2>
      <Summary>
        <SummaryItem label="Username" value={user.username} />
        <SummaryItem label="Forename(s)" value={user.forenames} />
        <SummaryItem label="Surname" value={user.surname} />
        <SummaryItem label="Phone number" value={user.phoneNumber} />
        <SummaryItem label="Email address" value={user.emailAddress} />
        <SummaryItem label="Postal address" value={user.postalAddress} />
        <SummaryItem label="Postcode" value={user.postCode} />
        <SummaryItem label="Endorsed by" value={user.endorsedBy} />
        <SummaryItem label="Organisation" value={user.orgServes} />
      </Summary>
      <ButtonGroup>
        <Link data-test="edit-user-view" href={`${user.username}/edit`}>
          {"Edit details"}
        </Link>
        <Link data-test="delete-user-view" href={`${user.username}/delete`}>
          {"Delete account"}
        </Link>
      </ButtonGroup>
    </Layout>
  </>
)

export default Users
