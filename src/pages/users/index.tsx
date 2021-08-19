import Layout from "components/Layout"
import Button from "components/Button"
import Head from "next/head"
import { LinkColumn, Table, TableHeaders } from "components/Table"
import { GetServerSideProps } from "next"
import { getAllUsers } from "useCases"
import getConnection from "lib/getConnection"
import KeyValuePair from "types/KeyValuePair"
import User from "types/User"
import { isError } from "types/Result"

export const getServerSideProps: GetServerSideProps = async () => {
  const connection = getConnection()
  const allUsers = await getAllUsers(connection)

  if (isError(allUsers)) {
    console.error(allUsers)
    return {
      props: {
        allUsers: null
      }
    }
  }

  return {
    props: {
      allUsers
    }
  }
}

interface Props {
  allUsers: KeyValuePair<string, string>[] | null
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const Users = ({ allUsers }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <a href="/users/newUser">
        <Button>{"Add user"}</Button>
      </a>
      {allUsers && (
        <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={allUsers}>
          <LinkColumn
            data-test="link-to-user-view"
            field="username"
            href={(user) => `users/${(user as User).username}`}
          />
        </Table>
      )}
    </Layout>
  </>
)

export default Users
