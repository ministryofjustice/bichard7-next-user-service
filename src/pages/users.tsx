import Layout from "components/Layout"
import Head from "next/head"
import Table, { TableHeaders, StringMap } from "components/Table"
import { GetServerSideProps } from "next"

import objectToProps from "lib/objectToProps"
import { getAllUsers, Users } from "lib/useCases"
import getConnection from "lib/getConnection"

export const getServerSideProps: GetServerSideProps = async () => {
  const connection = getConnection()
  const allUsers = await getAllUsers(connection)
  return objectToProps<Users>({ allUsers })
}

interface Props {
  allUsers: StringMap[] | null
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
    <Layout>{allUsers && <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={allUsers} />}</Layout>
  </>
)

export default users
