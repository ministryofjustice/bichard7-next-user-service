import Layout from "components/Layout"
import Head from "next/head"
import { GetServerSideProps } from "next"
import { Table, LinkColumn, TableHeaders } from "components/Table"
import Users from "lib/Users"
import { User } from "lib/User"
import KeyValuePair from "types/KeyValuePair"
import { isSuccess } from "../../lib/UsersResult"

export const getServerSideProps: GetServerSideProps = async () => {
  let usersList = null
  const result = await Users.list()

  if (isSuccess(result)) {
    usersList = result
  }

  return {
    props: { usersList }
  }
}

interface Props {
  usersList: KeyValuePair<string, string>[] | null
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const users = ({ usersList }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      {usersList && (
        <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={usersList}>
          <LinkColumn field="username" href={(user) => `users/${(user as User).username}`} />
        </Table>
      )}
    </Layout>
  </>
)

export default users
