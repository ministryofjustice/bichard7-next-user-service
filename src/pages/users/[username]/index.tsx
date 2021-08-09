import Layout from "components/Layout"
import Head from "next/head"
import db from "lib/db"
import { User } from "lib/User"
import { GetServerSideProps } from "next"
import FetchUserUseCase from "use-cases/FetchUserUseCase"
import { Summary, SummaryItem } from "components/Summary"
import BackLink from "components/BackLink"
import Link from "components/Link"
import ButtonGroup from "components/ButtonGroup"

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query
  const useCase = new FetchUserUseCase(db)
  const user = await useCase.fetch(username as string)

  if (!user) {
    return {
      notFound: true
    }
  }

  return {
    props: { user }
  }
}

interface Props {
  user: User
}

const index = ({ user }: Props) => (
  <>
    <Head>
      <title>{"User details"}</title>
    </Head>
    <Layout>
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
        <Link href={`${user.username}/delete`}>{"Delete account"}</Link>
      </ButtonGroup>
    </Layout>
  </>
)

export default index
