import Layout from "components/Layout"
import Button from "components/Button"
import Head from "next/head"
import { Table, TableHeaders } from "components/Table"
import { GetServerSideProps } from "next"
import { getAllUsers } from "useCases"
import getConnection from "lib/getConnection"
import isError from "lib/isError"
import KeyValuePair from "types/KeyValuePair"

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

const users = ({ allUsers }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <a href="/newUser">
        <Button>{"Add user"}</Button>
      </a>
      {allUsers && <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={allUsers} />}
    </Layout>
  </>
)

export default users
